
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { AhorcadoService } from '../../../services/ahorcado/ahorcado.service';
import { AuthService } from '../../../services/auth.service';
import { SupabaseService } from '../../../services/supabase.service';



@Component({
    selector: 'app-ahorcado',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './ahorcado.component.html',
    styleUrl: './ahorcado.component.css'
})


export class AhorcadoComponent implements OnInit {

    palabras: string[] = ['ANGULAR', 'SERVICIO', 'AHORCADO', 'COMPONENTE', 'DESARROLLO'];
    palabraSecreta: string = '';
    palabraMostrada: string[] = [];

    abecedario: string[] = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
    letrasUsadas: string[] = [];

    intentosRestantes: number = 6;
    mensaje: string = '';


    constructor ( 
        router: Router ,
        private ahorcadoService: AhorcadoService,
        private authService: AuthService,
        private supabaseService: SupabaseService

    ) {

    }

    ngOnInit(): void {
        this.iniciarNuevaPartida();
    }

    iniciarNuevaPartida() {
        // Elegir palabra secreta aleatoria
        const index = Math.floor(Math.random() * this.palabras.length);
        this.palabraSecreta = this.palabras[index];

        // Inicializar palabra mostrada con guiones
        this.palabraMostrada = Array(this.palabraSecreta.length).fill('_');

        this.letrasUsadas = [];
        this.intentosRestantes = 6;
        this.mensaje = '';
    }

    adivinarLetra(letra: string) {
        if (this.letrasUsadas.includes(letra) || this.mensaje !== '') return;

        this.letrasUsadas.push(letra);

        const indices = [...this.palabraSecreta]
            .map((char, i) => (char === letra ? i : -1))
            .filter(i => i !== -1);

        if (indices.length > 0) {
            // Letra correcta
            indices.forEach(i => this.palabraMostrada[i] = letra);

            if (!this.palabraMostrada.includes('_')) {
                this.mensaje = '¡Ganaste! 🎉';
                this.guardarPartida(true);
            }
        } else {
            // Letra incorrecta
            this.intentosRestantes--;

            if (this.intentosRestantes <= 0) {
                this.mensaje = `Perdiste 😢. La palabra era: ${this.palabraSecreta}`;
                this.palabraMostrada = this.palabraSecreta.split('');
                this.guardarPartida(false);
            }
        }
    }

    // Método para guardar la partida después de ganar o perder
    async guardarPartida(gano: boolean) {
        const userId = await this.authService.getUserId();  // Obtener user_id si está logueado
        
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

}
