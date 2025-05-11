// Angular core y módulos esenciales
import { Component, Inject, OnInit, OnDestroy, PLATFORM_ID, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

// Angular Material para notificaciones
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// RXJS
import { Subscription } from 'rxjs';

// Interfaces y servicios propios
import { IUser } from '../../lib/interfaces';
import { SupabaseService } from '../../services/supabase.service';
import { UserService } from '../../services/user.service';


/**
* Componente de registro de nuevos usuarios.
* Este componente permite al usuario crear una cuenta ingresando:
* username, email, teléfono y contraseña.
* Una vez registrado, se lo redirige a la página principal.
*/
@Component({
    selector: 'app-register',
    standalone: true,
    imports: [FormsModule, CommonModule, RouterModule, MatSnackBarModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css', '../../../styles.css'], // por mas de que haya importado lso estilos generales, no me funciono
})

export class RegisterComponent implements OnInit, OnDestroy{

    // ======== MODELO DEL FORMULARIO ========

    /** Usuario nuevo a registrar */
    newUser: IUser = {
        id: '',
        created_at: '',
        username: '',
        password: '',
        email: '',
        phone: '',
    };

    // ======== DATOS DEL COMPONENTE ========

    /** Lista de usuarios obtenidos desde Supabase */
    users: IUser[] = [];

    /** Para validar si se está ejecutando en navegador (SSR o no) */
    isBrowser: boolean = false; 

    /** Suscripción al observable de usuarios */
    private usersSubscription?: Subscription; 

    /** Diccionario con errores por campo */
    formErrors: { [key: string]: string } = {};


    // ======== CONSTRUCTOR ========

    constructor(
        private router: Router, 
        private snackBar: MatSnackBar,
        private userService: UserService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }


    // ======== CICLOS DE VIDA ========

    /**
     * Al iniciar el componente, se suscribe a la lista de usuarios si está en plataforma cliente.
     */
    ngOnInit(): void {
        if (!this.isBrowser) return;

        // Suscripción al observable de usuarios
        this.usersSubscription = this.userService.users$.subscribe({
            next:(users: IUser[]) => {
                this.users = users;

                // Guardar en localStorage solo si es navegador
                try {
                    localStorage.setItem('users', JSON.stringify(users));
                } catch (error) {
                    this.showMessage('Error al cargar los usuarios', true);
                }
            },
            error:(error: any) => {
                console.error("ERROR al cargar los usuarios", error);
                this.showMessage("No se pudo obtener la lista de usuarios", true);
            }
        })
    }

    /**
     * Al destruir el componente, se desuscribe del observable si corresponde.
     */
    ngOnDestroy(): void {
        this.usersSubscription?.unsubscribe();
    }


    // ======== EVENTOS ========

    /**
     * Evento que se dispara al enviar el formulario de registro.
     * Valida los campos y registra al usuario usando el UserService.
     */
    async onRegister(): Promise<void> {
        const { username, email, password, phone } = this.newUser;
    
        // Limpiar errores anteriores
        this.formErrors = {};

        // Validaciones básicas del formulario
        if (!username) this.formErrors["username"] = 'El nombre de usuario es obligatorio.';
        if (!email) this.formErrors["email"] = 'El correo electrónico es obligatorio.';
        if (!password) this.formErrors["password"] = 'La contraseña es obligatoria.';
        if (!phone) this.formErrors["phone"] = 'El teléfono es obligatorio.';
    
        // Si hay errores, detener el proceso y mostrar los errores debajo de los inputs
        if (Object.keys(this.formErrors).length > 0) return;


        try {
            // Registro de usuario
            await this.userService.register({ 
                username, 
                email, 
                password, 
                phone: phone.toString() 
            });

            this.showMessage('Registro exitoso 🎉', false);
            this.router.navigate(['/home']);

        } catch (error: any) {
            const mensaje = error?.message || 'Error desconocido al registrar usuario';

            // Mapear errores específicos al campo correspondiente
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


    // ======== MÉTODOS AUXILIARES ========

    /**
     * Muestra un mensaje en la pantalla (tipo snackbar).
     * @param mensaje El texto del mensaje
     * @param esError Si es un mensaje de error (true) o éxito (false)
     */
    showMessage(mensaje: string, esError: boolean = false): void {
        this.snackBar.open(mensaje, 'Cerrar', {
            duration: 10000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: [esError ? 'snackbar-error' : 'snackbar-success']
        });
    }
}

