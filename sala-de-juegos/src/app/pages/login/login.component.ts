
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar }  from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [FormsModule, CommonModule, RouterModule], //pongo el FormsModule aca sino me tira error en el HTML ngForm, el RouterModule es para que me funcione el routerLink en el html
})
export class LoginComponent {

  username: string = '';
  password: string = '';


  constructor(private router: Router, private snackBar: MatSnackBar) {}

  /**
   * Maneja el proceso de login del usuario.
   * 
   * Si las credenciales (usuario y contraseña) son correctas,
   * redirige al usuario a la página principal (/home).
   * Si son incorrectas, muestra un mensaje de error en pantalla.
  */
  onLogin(){
    //Verifica si el usuario y la contraseña son 'a'
    if (this.username === 'a' && this.password === 'a') {
      // Muestra un mensaje en la consola (sólo para desarrollo)
      console.log('Login exitoso');
    

      // Redirige al usuario a la página principal 'home'
      this.router.navigate(['/home']);

    } else {
      this.snackBar.open('usuario o contraseña incorrectos', 'Cerrar', {
        duration: 3000, // 3 segundos
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }

}
