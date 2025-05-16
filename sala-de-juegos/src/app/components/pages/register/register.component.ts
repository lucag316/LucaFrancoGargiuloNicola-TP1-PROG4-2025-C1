
// Angular core y módulos esenciales
import { Component, Inject, OnInit, OnDestroy, PLATFORM_ID  } from '@angular/core'; // ViewChild (fijarme si agregarlo))
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms'; // NgForm(fijarme si agreagrlo)
import { RouterModule, Router } from '@angular/router';

// Angular Material para notificaciones
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// RXJS
import { Subscription } from 'rxjs';

// Interfaces y servicios propios
import { IUser } from '../../../lib/interfaces';
import { SupabaseService } from '../../../services/supabase/supabase.service'; // CREO QUE SE PUEDE SACAR
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

    /** 
     * Modelo base del usuario nuevo. 
     * Los campos `id` y `created_at` se dejan vacíos porque se generan automáticamente desde Supabase.
     */
    newUser: IUser = {
        id: '',
        created_at: '',
        username: '',
        password: '',
        email: '',
        phone: '',
    };

     /** Campo auxiliar para confirmar la contraseña */
    confirmPassword: string = '';

    // ======== DATOS DEL COMPONENTE ========

    /** Lista de usuarios obtenidos desde Supabase */
    users: IUser[] = [];

    /** Indica si el entorno actual es un navegador (no SSR) */
    isBrowser: boolean = false; 

    /** Suscripción activa al observable de usuarios */
    private usersSubscription?: Subscription; 

    /** Diccionario de errores por campo */
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
     * Al iniciar, se suscribe a los usuarios si está en navegador.
     * Guarda los datos en localStorage para acceso rápido.
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
                    this.showMessage('Error al guardar usuarios localmente', true);
                }
            },
            error:(error: any) => {
                console.error("ERROR al cargar los usuarios", error);
                this.showMessage("No se pudo obtener la lista de usuarios", true);
            }
        });
    }

    /**
     * Al destruir el componente, se libera la suscripción al observable.
     */
    ngOnDestroy(): void {
        this.usersSubscription?.unsubscribe();
    }


    // ======== EVENTOS ========

    /**
     * Evento al enviar el formulario de registro.
     * Realiza validaciones manuales y envía los datos al servicio.
     */
    async onRegister(): Promise<void> {
        const { username, email, password, phone } = this.newUser;
    
        // Limpiar errores anteriores
        this.formErrors = {};

        // === VALIDACIÓN MANUAL ===
        // Se validan los campos obligatorios antes de continuar
        const camposObligatorios = [
            { campo: 'username', mensaje: 'El nombre de usuario es obligatorio.' },
            { campo: 'email', mensaje: 'El correo electrónico es obligatorio.' },
            { campo: 'password', mensaje: 'La contraseña es obligatoria.' },
            { campo: 'phone', mensaje: 'El teléfono es obligatorio.' },
        ];

        camposObligatorios.forEach(({ campo, mensaje }) => {
            if (!this.newUser[campo as keyof IUser]) {
                this.formErrors[campo] = mensaje;
            }
        });

        // Validación: contraseñas deben coincidir
        if (this.newUser.password !== this.confirmPassword) {
            this.formErrors["confirmPassword"] = 'Las contraseñas no coinciden.';
        }
    
        // Si hay errores, cancelar el registro
        if (Object.keys(this.formErrors).length > 0) return;


        try {
            // Registro del usuario usando el servicio
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
     * Muestra un mensaje (tipo snackbar) en pantalla.
     * @param mensaje Texto a mostrar
     * @param esError Define si es mensaje de error (true) o de éxito (false)
     */
    showMessage(mensaje: string, esError: boolean = false): void {
        this.snackBar.open(mensaje, 'Cerrar', {
            duration: 10000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: [esError ? 'snackbar-error' : 'snackbar-success']
        });
    }

    checkPasswordMatch(): void {
        if (this.confirmPassword && this.newUser.password !== this.confirmPassword) {
            this.formErrors["confirmPassword"] = 'Las contraseñas no coinciden.';
        } else {
            delete this.formErrors["confirmPassword"];
        }
    }
}

