

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


import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
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

  username: string = '';
  password: string = '';
  isBrowser: boolean = false;

  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router, 
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

    async onLogin() {
      if (!this.username || !this.password) {
        this.showMessage('Usuario y contraseña son obligatorios', true);
        return;
      }
  
      try {
        const { error } = await this.authService.loginWithUsername(this.username, this.password);
  
        if (error) {
          if (error.message.includes('Email not confirmed')) {
            this.showMessage('Email no confirmado. Por favor verifica tu correo.', true);
          } else {
            this.showMessage('Error al iniciar sesión: ' + error.message, true);
          }
          return;
        }
  
        this.showMessage('Inicio de sesión exitoso');
        this.router.navigate(['/home']);
  
      } catch (err: any) {
        this.showMessage('Error inesperado: ' + err.message, true);
      }
    }


  /*
  * mensaje: el texto que quieras mostrar.
  * esError: si es true, le da la clase snackbar-error (rojo); si es false, le da snackbar-success (verde).
  * */
  showMessage(mensaje: string, esError: boolean = false) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [esError ? 'snackbar-error' : 'snackbar-success']
    });
  }

}




