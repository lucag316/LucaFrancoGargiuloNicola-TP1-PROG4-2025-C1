
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar }  from '@angular/material/snack-bar';
import { SupabaseService } from '../../services/supabase.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [FormsModule, CommonModule, RouterModule], //pongo el FormsModule aca sino me tira error en el HTML ngForm, el RouterModule es para que me funcione el routerLink en el html
  standalone: true
})
export class LoginComponent {

  username: string = '';
  password: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private router: Router, 
    private snackBar: MatSnackBar,
    private supabase: SupabaseService
  ) {}

  /**
   * Maneja el proceso de login del usuario.
   * 
   * Si las credenciales (usuario y contraseña) son correctas,
   * redirige al usuario a la página principal (/home).
   * Si son incorrectas, muestra un mensaje de error en pantalla.
  */
  onLogin(){
    //Verifica si el usuario y la contraseña son 'a'
    if (this.username === 'aaa' && this.password === 'aaa') {
      // Muestra un mensaje en la consola (sólo para desarrollo)
      console.log('Login exitoso');
      this.showMessage('Login exitoso', false); // verde

      // Redirige al usuario a la página principal 'home'
      this.router.navigate(['/home']);

    }  else {
      this.showMessage('Usuario o contraseña incorrectos', true); // rojo
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
