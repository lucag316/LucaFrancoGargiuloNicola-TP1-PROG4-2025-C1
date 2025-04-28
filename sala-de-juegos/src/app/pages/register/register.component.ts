

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatSnackBar }  from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  username: string = '';
  password: string = '';
  email: string = '';
  phone: string = '';

  constructor(private router: Router, private snackBar: MatSnackBar) {}

  /**
   * Maneja el proceso de registro de usuario.
   * 
   * Si todos los campos están completos, simula un registro exitoso
   * y redirige al usuario a la página de login (/login).
   * De lo contrario, muestra un mensaje de error.
   */
  onRegister() {
    if (this.username && this.password && this.email && this.phone) {
      console.log('Registro exitoso');

      // Después del registro, podría guardar los datos en un servicio o backend
      // Por ahora simplemente redirige al home
      this.router.navigate(['/home']);
    } else {
        this.snackBar.open('Por favor completa todos los campos', 'Cerrar', {
          duration: 3000, // 3 segundos
          horizontalPosition: 'center',
          verticalPosition: 'top',
      });
    }
  }
}
