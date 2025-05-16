
/**
 * Componente: RegisterComponent
 * 
 * Descripción:
 * Este componente gestiona el formulario de registro para nuevos usuarios.
 * Permite ingresar nombre de usuario, email, teléfono, contraseña y confirmación de contraseña.
 * Utiliza validaciones HTML y validaciones cruzadas para garantizar la integridad del registro.
 * 
 * Funcionalidades:
 * - Validaciones en tiempo real con Angular Forms (Template-driven).
 * - Verifica coincidencia entre contraseña y confirmación.
 * - Muestra errores personalizados en caso de problemas durante el registro (por ejemplo, email duplicado).
 * - Almacena la lista de usuarios en localStorage para acceso rápido (solo si es navegador).
 * - Utiliza Angular Material Snackbar para mostrar mensajes de éxito o error.
 * 
 * Tecnologías:
 * - Angular Standalone Components
 * - Template-driven Forms
 * - RxJS (suscripción a usuarios)
 * - Angular Material (SnackBar)
 * - Supabase + Servicio propio `UserService`
 * 
 * Notas:
 * - El componente se autodetecta si está corriendo en un entorno de navegador (para evitar errores en SSR).
 * - Usa la interfaz `IUser` como modelo de datos.
 * - El botón de registro se desactiva si el formulario es inválido o las contraseñas no coinciden.
 */


// Angular core y módulos esenciales
import { Component, Inject, OnInit, OnDestroy, PLATFORM_ID  } from '@angular/core'; // ViewChild (fijarme si agregarlo))
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms'; 
import { RouterModule, Router } from '@angular/router';

// Angular Material para notificaciones tipo toast
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// RXJS para manejo de subscripciones
import { Subscription } from 'rxjs';

// Interfaces y servicios propios
import { IUser } from '../../../lib/interfaces';
//import { SupabaseService } from '../../../services/supabase/supabase.service'; // CREO QUE SE PUEDE SACAR
import { UserService } from '../../../services/user/user.service';


/**
 * Componente de registro de nuevos usuarios.
 * Permite crear una cuenta ingresando nombre de usuario, correo, teléfono y contraseña.
 * Si el registro es exitoso, redirige al usuario a la página principal.
 */
@Component({
    selector: 'app-register',
    standalone: true,
    imports: [FormsModule, CommonModule, RouterModule, MatSnackBarModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css', '../../../../styles.css'], // por mas de que haya importado lso estilos generales, no me funciono
})

export class RegisterComponent implements OnInit, OnDestroy{

    // ======== MODELO DEL FORMULARIO ========

    /** Modelo del nuevo usuario que se va a registrar */
    newUser: IUser = {
        id: '',
        created_at: '',
        username: '',
        password: '',
        email: '',
        phone: '',
    };

     /** Confirmación de contraseña ingresada por el usuario */
    confirmPassword: string = '';

    // ======== DATOS DEL COMPONENTE ========

    /** Lista de todos los usuarios existentes, obtenida desde el servicio */
    users: IUser[] = [];

    /** Indica si el entorno actual es un navegador (no SSR) */
    isBrowser: boolean = false; 

    /** Suscripción activa al observable de usuarios */
    private usersSubscription?: Subscription; 

    /** Diccionario con errores personalizados por campo del formulario */
    formErrors: { [key: string]: string } = {};


    // ======== CONSTRUCTOR ========

    constructor(
        private router: Router, 
        private snackBar: MatSnackBar,
        private userService: UserService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        // Detecta si el entorno es navegador para evitar errores en SSR
        this.isBrowser = isPlatformBrowser(this.platformId);
    }


    // ======== CICLOS DE VIDA ========

    /** Se ejecuta al iniciar el componente */
    ngOnInit(): void {
        if (!this.isBrowser) return;

         // Se suscribe al observable de usuarios
        this.usersSubscription = this.userService.users$.subscribe({
            next:(users: IUser[]) => {
                this.users = users;

                // Guarda los usuarios en localStorage (solo en navegador)
                try {
                    localStorage.setItem('users', JSON.stringify(users));
                } catch (error) {
                    this.showMessage('Error al guardar usuarios localmente', true);
                }
            },
            error:(error: any) => {
                console.error("ERROR al cargar los usuarios", error);
                this.showMessage("No se pudo obtener la lista de usuarios", true);
            }
        });
    }

    /** Se ejecuta al destruir el componente: cancela suscripciones activas */
    ngOnDestroy(): void {
        this.usersSubscription?.unsubscribe();
    }


    // ======== EVENTOS ========

    /**
     * Maneja el evento de envío del formulario de registro.
     * Realiza validaciones cruzadas (contraseña) y utiliza el servicio para registrar.
     */
    async onRegister(form: NgForm): Promise<void> {
        if (form.invalid || this.newUser.password !== this.confirmPassword) {
            this.formErrors["confirmPassword"] = 'Las contraseñas no coinciden.';
            
            // Marca todos los controles como tocados para mostrar errores
            Object.values(form.controls).forEach(control => control.markAsTouched());
            return;
        }

    const { username, email, password, phone } = this.newUser;



        try {
            // Llama al servicio para registrar el usuario
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

            // Asigna mensajes personalizados a campos según el error
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
     * Muestra una notificación tipo snackbar en pantalla.
     * @param mensaje Texto del mensaje
     * @param esError Si es true, se muestra como error. Si es false, como éxito.
     */
    showMessage(mensaje: string, esError: boolean = false): void {
        this.snackBar.open(mensaje, 'Cerrar', {
            duration: 10000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: [esError ? 'snackbar-error' : 'snackbar-success']
        });
    }


    /**
     * Verifica si las contraseñas coinciden y actualiza el error correspondiente.
     * Se ejecuta al perder foco en el campo de confirmación.
     */
    checkPasswordMatch(): void {
        if (this.confirmPassword && this.newUser.password !== this.confirmPassword) {
            this.formErrors["confirmPassword"] = 'Las contraseñas no coinciden.';
        } else {
            delete this.formErrors["confirmPassword"];
        }
    }

}

