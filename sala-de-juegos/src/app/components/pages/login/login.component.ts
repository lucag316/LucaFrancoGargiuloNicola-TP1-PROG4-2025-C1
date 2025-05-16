// ========================================================
// Componente: LoginComponent
// Descripción:
//   Este componente permite al usuario iniciar sesión con su
//   nombre de usuario y contraseña. También incluye un modo
//   de ingreso rápido (demo) y muestra mensajes de feedback.
// ========================================================

import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router'

// Angular Material
import { MatSnackBar }  from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Servicios
import { SupabaseService } from '../../../services/supabase/supabase.service';
import { UserService } from '../../../services/user/user.service';
import { AuthService } from '../../../services/auth/auth.service';



@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    imports: [
        FormsModule,          // Para usar ngForm y [(ngModel)]
        CommonModule,
        RouterModule,         // Para routerLink en el HTML
        MatSnackBarModule     // Para mostrar notificaciones (snackbar)
    ]
})


export class LoginComponent {

    // Propiedades del formulario
    username: string = '';
    password: string = '';

    // Estado general del componente
    errorMessage: string = '';
    loading: boolean = false;
    isBrowser: boolean = false;  // True si se está ejecutando en navegador (no en SSR)

    constructor(
        private userService: UserService,     // Maneja datos del usuario
        private authService: AuthService,     // Servicio de autenticación
        private router: Router,               // Para redirecciones
        private snackBar: MatSnackBar,        // Para mostrar mensajes
        @Inject(PLATFORM_ID) private platformId: Object // Para saber si estamos en el navegador
    ) {
        // Determina si la app está corriendo en el navegador
        this.isBrowser = isPlatformBrowser(this.platformId);
    }


    // ===============================
    // Función: onLogin
    // Descripción:
    //   Intenta autenticar al usuario con los datos del formulario.
    //   Muestra mensajes de error específicos si los datos son incorrectos.
    // ===============================
    async onLogin() {
        // Validación básica del lado del cliente
        if (!this.username || !this.password) {
            this.showMessage('Usuario y contraseña son obligatorios', true);
            return;
        }
    
        try {
            // Llama al servicio de autenticación
            const { error } = await this.authService.loginWithUsername(this.username, this.password);
    
            if (error) {
                // Errores esperables
                if (error.message.includes('Email not confirmed')) {
                    this.showMessage('Email no confirmado. Por favor verifica tu correo.', true);
                } else if (error.message.includes('Invalid login credentials')) {
                    this.showMessage('Usuario o contraseña incorrectos.', true); 
                } else {
                    this.showMessage('Error al iniciar sesión: ' + error.message, true);
                }
                return;
            }
    
            // Inicio de sesión exitoso
            this.showMessage('Inicio de sesión exitoso');
            this.router.navigate(['/home']);
    
        } catch (err: any) {
            // Errores inesperados (ej. red, servidor)
            this.showMessage('Error inesperado: ' + err.message, true);
        }
    }

    // ===============================
    // Función: loginRapido
    // Descripción:
    //   Realiza un login automático con un usuario de prueba.
    // ===============================
    async loginRapido(): Promise<void> {
        this.username = 'luca';      // Usuario de prueba (debe existir en Supabase)
        this.password = '123456';    // Contraseña del demo
        await this.onLogin();        // Ejecuta el login normalmente
    }

    /**
     * Muestra un mensaje tipo snackbar en la pantalla.
     * @param mensaje Texto del mensaje a mostrar
     * @param esError Si es true, se muestra en rojo; si es false, en verde
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




