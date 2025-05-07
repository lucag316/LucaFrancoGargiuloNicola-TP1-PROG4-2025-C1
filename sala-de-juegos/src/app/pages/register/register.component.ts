
import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { MatSnackBar }  from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { Subscription } from 'rxjs';

import { IUser } from '../../lib/interfaces';
import { SupabaseService } from '../../services/supabase.service';


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
    styleUrl: './register.component.css',
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

    constructor(
        private router: Router, 
        private snackBar: MatSnackBar,
        private supabase: SupabaseService,
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

        this.usersSubscription = this.supabase.users$.subscribe({
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
    
        if (!username || !email || !password || !phone) {
            this.showMessage('Todos los campos son obligatorios', true);
            return;
        }
    
        try {
            await this.supabase.register({ 
                username, 
                email, 
                password, 
                phone: phone.toString() });

            this.showMessage('Registro exitoso', false);
            this.router.navigate(['/home']);

        } catch (error: any) {
            console.error('Error durante el registro:', error);
            const mensaje = error?.message || 'Error desconocido al registrar usuario';
            this.showMessage(mensaje, true);
        }
    }

    /**
    * Muestra un mensaje tipo snackbar (éxito o error).
    * @param mensaje Texto a mostrar
    * @param esError Define si el mensaje es de error (true) o de éxito (false)
    */
    showMessage(mensaje: string, esError: boolean = false) {
        this.snackBar.open(mensaje, 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: [esError ? 'snackbar-error' : 'snackbar-success']
        });
    }
}

