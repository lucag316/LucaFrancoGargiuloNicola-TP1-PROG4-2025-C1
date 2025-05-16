// ========================================================
// Componente: HomeComponent
// Descripción:
//   Página principal del proyecto. Muestra los juegos
//   disponibles y permite navegar a ellos si el usuario
//   está autenticado.
// ========================================================

import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../../services/auth/auth.service';
import { NotificacionesService } from '../../../services/notificaciones/notificaciones.service';


@Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
})


export class HomeComponent {

    constructor(
        private authService: AuthService,
        private router: Router,
        private notificacionesService: NotificacionesService
    ) { }

    // ========================================================
    // Método: jugar
    // --------------------------------------------------------
    // Redirige al juego solicitado si el usuario está logueado.
    // Si no lo está, muestra un mensaje informativo.
    //
    // @param nombreJuego - nombre de la ruta del juego
    // ========================================================
    jugar(nombreJuego: string) {
        if (this.authService.getCurrentAuthStatus()) {

            // Si el usuario está logueado, redirige al juego
            this.router.navigate([`/${nombreJuego}`]);
        } else {
            // Si no está logueado, muestra un mensaje de advertencia
            this.notificacionesService.showMessage('Necesitás loguearte para jugar.', true);
        }
    }
}
