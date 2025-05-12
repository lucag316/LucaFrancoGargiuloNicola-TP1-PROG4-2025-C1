
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
    selector: 'app-home',
    standalone: true,
    imports: [],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
})


export class HomeComponent {

    constructor(
        private authService: AuthService,
        private router: Router,
        private snackBar: MatSnackBar,
    ) { }

    jugar(nombreJuego: string) {
        if (this.authService.getCurrentAuthStatus()) {

            // Si el usuario está logueado, redirige al juego
            this.router.navigate([`/${nombreJuego}`]); 
        } else {
            // Si no está logueado, muestra un mensaje de advertencia
            this.snackBar.open('Necesitás loguearte para jugar.', 'Cerrar', {
                duration: 3000
            });

        }
    }
}
