

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';


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
  errorMessage: string = '';

  constructor(private router: Router) {}

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
      this.errorMessage = '';
      
      // Después del registro, podría guardar los datos en un servicio o backend
      // Por ahora simplemente redirige al home
      this.router.navigate(['/home']);
    } else {
      this.errorMessage = 'Por favor completa todos los campos';
    }
  }
}
