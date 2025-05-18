
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AhorcadoService } from '../../../../services/ahorcado/ahorcado.service';
import { AuthService } from '../../../../services/auth/auth.service';


@Component({
    selector: 'app-ahorcado',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './ahorcado.component.html',
    styleUrl: './ahorcado.component.css'
})


export class AhorcadoComponent implements OnInit {

    // ========================================================
    // Configuración inicial
    // ========================================================
    private readonly MAX_INTENTOS: number = 6;
    palabras: string[] = ['JOAQUINGAY', 'FASCESELACOME'];
    abecedario: string[] = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
    
    // Estado del juego
    palabraSecreta: string = '';
    palabraMostrada: string[] = [];
    letrasUsadas: string[] = [];
    intentosRestantes: number = this.MAX_INTENTOS;
    mensaje: string = '';
    juegoTerminado: boolean = false;


    constructor ( 
        private ahorcadoService: AhorcadoService,
        private authService: AuthService,
    ) {

    }

    // ========================================================
    // Ciclo de vida
    // ========================================================
    ngOnInit(): void {
        this.iniciarNuevaPartida();
    }

    // ========================================================
    // Lógica principal del juego
    // ========================================================

    /**
     * Inicializa una nueva partida: selecciona palabra, reinicia estado.
     */
    iniciarNuevaPartida() {
        this.palabraSecreta = this.obtenerPalabraAleatoria();
        this.palabraMostrada = Array(this.palabraSecreta.length).fill('_'); // Inicializa palabra mostrada con guiones
        this.letrasUsadas = [];
        this.intentosRestantes = this.MAX_INTENTOS;
        this.mensaje = '';
        this.juegoTerminado = false;
    }

    /**
   * Procesa la letra que el usuario adivina.
   * Si ya fue usada o el juego terminó, no hace nada.
   * @param letra Letra seleccionada
   */
    adivinarLetra(letra: string) {
        if (this.letrasUsadas.includes(letra) || this.juegoTerminado) return;

        this.letrasUsadas.push(letra);

        const aciertos = this.revelarLetraEnPalabra(letra);

        if (aciertos > 0) {
            // Si no quedan guiones, ganó
            if (!this.palabraMostrada.includes('_')) {
                this.mensaje = '¡Ganaste! 🎉';
                this.juegoTerminado = true;
                this.guardarPartida(true);
            }
        } else {
            // Letra incorrecta
            this.intentosRestantes--;

            if (this.intentosRestantes <= 0) {
                this.mensaje = `Perdiste 😢. La palabra era: ${this.palabraSecreta}`;
                this.palabraMostrada = this.palabraSecreta.split('');
                this.juegoTerminado = true;
                this.guardarPartida(false);
            }
        }
    }

    /**
    * Guarda la partida en la base de datos (usuario logueado o no).
    * @param gano true si ganó, false si perdió
    */
    async guardarPartida(gano: boolean): Promise<void> {
        let userId: string | null = null;

        try {
            const { id } = await this.authService.getUserInfo();
            userId = id;
        } catch {
            // Si no está logueado, userId queda como null
        }

        const resultado: 'ganó' | 'perdió' = gano ? 'ganó' : 'perdió';
        
        const partida = {
            user_id: userId,  // Puede ser null si no está logueado
            palabra: this.palabraSecreta,
            letras_usadas: this.letrasUsadas,
            intentos: this.intentosRestantes,
            resultado: resultado,
            fecha: new Date().toISOString()
        };

        try {
            await this.ahorcadoService.guardarPartida(partida);
            console.log('Partida guardada correctamente');
        } catch (error) {
            console.error('Error al guardar la partida', error);
        }
    }

    /**
   * Reinicia el estado del juego completamente.
   */
    reiniciarJuego(): void {
        this.iniciarNuevaPartida();
    }

    /**
   * Alias para reiniciar el juego al volver a jugar.
   */
    volverAJugar(): void {
        this.reiniciarJuego();
    }


     // ========================================================
    // Helpers
    // ========================================================

    /**
     * Devuelve una palabra aleatoria del listado.
     */
    private obtenerPalabraAleatoria(): string {
        const index = Math.floor(Math.random() * this.palabras.length);
        return this.palabras[index];
    }

    /**
     * Revela todas las ocurrencias de una letra en la palabra.
     * @returns cantidad de letras reveladas
     */
    private revelarLetraEnPalabra(letra: string): number {
        let aciertos = 0;

        for (let i = 0; i < this.palabraSecreta.length; i++) {
            if (this.palabraSecreta[i] === letra) {
                this.palabraMostrada[i] = letra;
                aciertos++;
            }
        }

        return aciertos;
    }
}
