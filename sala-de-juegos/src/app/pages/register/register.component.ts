
import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { MatSnackBar }  from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { Subscription } from 'rxjs';

import { IUser } from '../../lib/interfaces';
import { SupabaseService } from '../../services/supabase.service';

import { UserService } from '../../services/user.service';

/**
* Componente de registro de nuevos usuarios.
* Permite completar un formulario con username, email, teléfono y contraseña,
* registrando el usuario en Supabase y redirigiéndolo al Home tras el alta exitosa.
*/
@Component({
    selector: 'app-register',
    standalone: true,
    imports: [FormsModule, CommonModule, RouterModule, MatSnackBarModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css', '../../../styles.css'], // por mas de que haya importado lso estilos generales, no me funciono
})

export class RegisterComponent {

    users: IUser[] = []; /** Lista de usuarios ya registrados, se actualiza desde Supabase */

    /** Nuevo usuario a registrar (modelo del formulario) */
    newUser: IUser = { 
        id: '',
        created_at: '',
        username: '',
        password: '',
        email: '',
        phone: '',
    }

    isBrowser: boolean = false; /** Para verificar si estamos ejecutando en navegador (no en SSR) */
    private usersSubscription?: Subscription; /** Suscripción al observable de usuarios para luego desuscribirse correctamente */

    // Objeto que almacena errores personalizados para cada campo
    formErrors: { [key: string]: string } = {};

    
    constructor(
        private router: Router, 
        private snackBar: MatSnackBar,
        private userService: UserService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }


    /**
    * Se ejecuta al inicializar el componente.
    * Se suscribe al observable de usuarios y los guarda en `this.users`.
    */
    ngOnInit() {
        if (this.isBrowser) {
            this.users = [];
        return;
        }

        this.usersSubscription = this.userService.users$.subscribe({
            next:(users: IUser[]) => {
                this.users = users;
                if (this.isBrowser){
                    try{
                        localStorage.setItem('users', JSON.stringify(this.users));
                    } catch (error) {
                        this.showMessage('Error al cargar los usuarios', true);
                    }
                }
            },
        error:(error: any) => {
            console.error("ERROR al cargar los usuarios", error);
        }
        })
    }


    /**
    * Método que se ejecuta al hacer submit en el formulario de registro.
    * Valida los campos y llama a Supabase para registrar al usuario.
    */
    async onRegister(): Promise<void> {
        const { username, email, password, phone } = this.newUser;
    
        // Limpiar errores anteriores
        this.formErrors = {};

        // Validación manual de campos requeridos
        if (!username) this.formErrors["username"] = 'El nombre de usuario es obligatorio.';
        if (!email) this.formErrors["email"] = 'El correo electrónico es obligatorio.';
        if (!password) this.formErrors["password"] = 'La contraseña es obligatoria.';
        if (!phone) this.formErrors["phone"] = 'El teléfono es obligatorio.';
    
        // Si hay errores, detener el proceso y mostrar los errores debajo de los inputs
        if (Object.keys(this.formErrors).length > 0) return;


        try {
            await this.userService.register({ 
                username, 
                email, 
                password, 
                phone: phone.toString() });

            this.showMessage('Registro exitoso', false);
            this.router.navigate(['/home']);

        } catch (error: any) {
            const mensaje = error?.message || 'Error desconocido al registrar usuario';

            // Manejo de errores específicos
            if (mensaje.toLowerCase().includes('email')) {
                this.formErrors["email"] = mensaje;
            } else if (mensaje.toLowerCase().includes('username')) {
                this.formErrors["username"] = mensaje;
            } else if (mensaje.toLowerCase().includes('password')) {
                this.formErrors["password"] = mensaje;
            } else {
                this.showMessage(mensaje, true);
            }
        }
    }

    /**
    * Muestra un mensaje tipo snackbar (éxito o error).
    * @param mensaje Texto a mostrar
    * @param esError Define si el mensaje es de error (true) o de éxito (false)
    */
    showMessage(mensaje: string, esError: boolean = false) {
        this.snackBar.open(mensaje, 'Cerrar', {
            duration: 10000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: [esError ? 'snackbar-error' : 'snackbar-success']
        });
    }
}

