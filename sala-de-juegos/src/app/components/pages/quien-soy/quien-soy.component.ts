

// -------------------- Angular Core & Comunes --------------------
import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

// -------------------- Interfaces --------------------

/**
* Representa la estructura de un usuario de GitHub
* que se obtiene desde la API pública de GitHub.
*/
interface GitHubUser{
    login: string;
    avatar_url: string;
    name: string;
    bio: string;
    location: string;
    followers: number;
    following: number;
    public_repos: number;
}

// -------------------- Componente --------------------

/**
* Componente "¿Quién Soy?" que consume datos desde la API de GitHub
* para mostrar información personal del usuario en la interfaz.
*/
@Component({
    selector: 'app-quien-soy',
    standalone: true, // Indica que es un componente independiente
    imports: [CommonModule, RouterModule], // Importa módulo común para usar directivas como *ngIf, *ngFor, etc.
    templateUrl: './quien-soy.component.html',
    styleUrl: './quien-soy.component.css',
})


export class QuienSoyComponent implements OnInit {

    /**
    * Signal reactivo que contiene la información del usuario de GitHub.
    * Inicialmente es null hasta que se recibe la respuesta de la API.
    */
    userData = signal<GitHubUser | null>(null);

    /**
    * Inyección del servicio HttpClient para realizar peticiones HTTP.
    */
    constructor(private http: HttpClient, private router: Router) { }

    /**
    * Hook que se ejecuta al inicializar el componente.
    * Se utiliza para disparar la carga de datos desde GitHub.
    */
    ngOnInit(): void {
        this.fetchGitHubData();
    }

    /**
    * Realiza una solicitud HTTP GET a la API de GitHub
    * para obtener los datos del usuario especificado.
    */

    private fetchGitHubData(): void {
        const username = 'lucag316'; // Nombre de usuario configurable
        const url = `https://api.github.com/users/${username}`;

        this.http.get<GitHubUser>(url).subscribe({
            next: (data) => this.userData.set(data),
            error: (error) => console.error('Error al obtener datos de GitHub:', error),
        });
    }

    /**
    * Método disparado al hacer clic en un botón para comenzar un juego.
    * Aquí podrías redirigir a otra vista, lanzar un modal, etc.
    */
    empezarJuego(): void {
        this.router.navigate(['/simon']);
    }

  /* // ASI LO HIZO EL PROFE
  fetchGitHubData() {
    this.http.get<GitHubUser>('https://api.github.com/users/lucag316')
      .subscribe({
        next: (data) => {
          this.userData.set(data);
        },
        error: (error) => {
          console.error("ERROR fetching GitHub data:", error);
        }
      });
  }*/

   

}
