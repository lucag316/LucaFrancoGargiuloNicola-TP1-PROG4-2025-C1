

/*
import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { MatSnackBar }  from '@angular/material/snack-bar';

import { Subscription } from 'rxjs';

import { IUser } from '../../lib/interfaces';
import { SupabaseService } from '../../services/supabase.service';
*/


import { Component, PLATFORM_ID, Inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router'
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { MatSnackBar }  from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { SupabaseService } from '../../services/supabase.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';



@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [FormsModule, CommonModule, RouterModule, MatSnackBarModule], //pongo el FormsModule aca sino me tira error en el HTML ngForm, el RouterModule es para que me funcione el routerLink en el html
})


export class LoginComponent {

  // Propiedades del formulario
  username: string = '';
  password: string = '';

  // Bandera para saber si estamos en el navegador 
  isBrowser: boolean = false;

  // Estados de la vista
  errorMessage: string = '';
  loading: boolean = false;

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


  /**
   * Intenta autenticar al usuario usando el username y password ingresado.
   * Muestra mensajes de error o éxito usando el snackbar.
   */
    async onLogin() {
      // Validación básica
      if (!this.username || !this.password) {
        this.showMessage('Usuario y contraseña son obligatorios', true);
        return;
      }
  
      try {
        // Llama al método de login del servicio de autenticación
        const { error } = await this.authService.loginWithUsername(this.username, this.password);
  
        if (error) {
          // Si el error tiene que ver con el email no confirmado
          if (error.message.includes('Email not confirmed')) {
            this.showMessage('Email no confirmado. Por favor verifica tu correo.', true);
          } else {
            this.showMessage('Error al iniciar sesión: ' + error.message, true);
          }
          return;
        }
  
        // Si no hubo error, redirecciona al home
        this.showMessage('Inicio de sesión exitoso');
        this.router.navigate(['/home']);
  
      } catch (err: any) {
        // Errores inesperados (por ejemplo, problemas de red)
        this.showMessage('Error inesperado: ' + err.message, true);
      }
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




