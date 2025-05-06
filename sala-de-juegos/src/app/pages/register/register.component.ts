






import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { MatSnackBar }  from '@angular/material/snack-bar';

import { Subscription } from 'rxjs';

import { IUser } from '../../lib/interfaces';
import { SupabaseService } from '../../services/supabase.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [FormsModule, CommonModule, RouterModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css',
})
export class RegisterComponent {

    users: IUser[] = []; // Lista de usuarios cargados desde Supabase
    newUser: IUser = { // Objeto que representa al nuevo usuario a registrar
        id: '',
        created_at: '',
        username: '',
        password: '',
        email: '',
        phone: '',
    }
    isBrowser: boolean = false; // Bandera para saber si se está ejecutando en el navegador
    private usersSubscription?: Subscription; // Referencia a la suscripción para limpiar al destruir el componente

    constructor(
        private router: Router, 
        private snackBar: MatSnackBar,
        private supabase: SupabaseService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }


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


    async onRegister() {
        try {
            const { username, email, password, phone } = this.newUser;
        
            console.log('Registrando usuario:', this.newUser); // Verifica los datos antes de enviar

            if (!username || !email || !password || !phone) {
                this.showMessage('Todos los campos son obligatorios', true);
                return;
            }
            console.log('Datos a enviar a Supabase:', this.newUser);

            const result = await this.supabase.register({
                username,
                email,
                password,
                phone: phone.toString(),
            });

        
            this.showMessage('Registro exitoso', false);
            this.router.navigate(['/home']); // o la ruta que tengas
    
        } catch (error: any) {
            console.error('Error completo:', error);
    
        // Verifica si el error contiene más detalles de Supabase
            if (error?.message) {
                this.showMessage('Error al registrar: ' + error.message, true);
            } else {
                // Mostrar detalles adicionales si están disponibles
                this.showMessage('Error desconocido', true);
            }
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


    /**
   * Maneja el proceso de registro de usuario.
   * 
   * Si todos los campos están completos, simula un registro exitoso
   * y redirige al usuario a la página de login (/login).
   * De lo contrario, muestra un mensaje de error.
   */
  /*
  onRegister() {
    if (this.username && this.password && this.email && this.phone) {
      console.log('Registro exitoso');

      this.showMessage('Registro exitoso', false); // verde

      // Después del registro, podría guardar los datos en un servicio o backend
      // Por ahora simplemente redirige al home
      this.router.navigate(['/home']);
    } else {
      this.showMessage('ERROR, vuelva a registrarse', true); // rojo
    }
  }
  
  */
  