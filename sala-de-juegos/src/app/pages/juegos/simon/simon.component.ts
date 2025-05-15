


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { SimonService } from '../../../services/simon/simon.service';
import { AuthService } from '../../../services/auth.service';
import { SupabaseService } from '../../../services/supabase.service';



@Component({
    selector: 'app-simon',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './simon.component.html',
    styleUrl: './simon.component.css'
})


export class SimonComponent implements OnInit {

    // --- Configuración ---
    readonly colores: string[] = [
        'rojo', 'verde', 'azul', 'amarillo',
        'naranja', 'violeta', 'negro', 'blanco'
    ];

    // --- Estado del juego ---
    secuencia: string[] = [];
    entradaUsuario: string[] = [];
    colorActivo: string | null = null;

    turnoUsuario = false;
    indiceUsuario = 0;
    mensaje = '';
    jugando = false;
    puntaje = 0;

    private inicioJuego: number = 0;

    constructor(private simonService: SimonService) {}

    ngOnInit(): void {}

    // --- Métodos públicos ---

    iniciarJuego(): void {
        this.resetearJuego();
        this.inicioJuego = Date.now();
        this.agregarColor();
    }

    async presionarColor(color: string): Promise<void> {
        if (!this.turnoUsuario) return;

        this.iluminarColor(color);
        this.entradaUsuario.push(color);

        if (color !== this.secuencia[this.indiceUsuario]) {
            this.finalizarJuego(false);
            return;
        }

        this.indiceUsuario++;

        if (this.indiceUsuario === this.secuencia.length) {
            this.puntaje++;
            this.turnoUsuario = false;

            setTimeout(() => this.agregarColor(), 1000);
        }
    }

    getClasesColor(color: string): Record<string, boolean> {
        return {
            [color]: true,
            'activo': this.colorActivo === color
        };
    }

  // --- Métodos privados ---

    private resetearJuego(): void {
        this.secuencia = [];
        this.entradaUsuario = [];
        this.indiceUsuario = 0;
        this.puntaje = 0;
        this.mensaje = '';
        this.jugando = true;
        this.turnoUsuario = false;
    }

    private agregarColor(): void {
        const nuevoColor = this.colores[Math.floor(Math.random() * this.colores.length)];
        this.secuencia.push(nuevoColor);
        this.reproducirSecuencia();
    }

    private reproducirSecuencia(): void {
        this.turnoUsuario = false;
        this.mensaje = 'Memorizá la secuencia...';

        let i = 0;
        const intervalo = setInterval(() => {
            this.iluminarColor(this.secuencia[i]);
            i++;

            if (i >= this.secuencia.length) {
                clearInterval(intervalo);
                this.turnoUsuario = true;
                this.entradaUsuario = [];
                this.indiceUsuario = 0;
                this.mensaje = 'Tu turno. Repetí la secuencia.';
            }
        }, 800);
    }

    private iluminarColor(color: string): void {
        this.colorActivo = color;
        setTimeout(() => this.colorActivo = null, 400);
    }

    private async finalizarJuego(gano: boolean): Promise<void> {
        this.jugando = false;
        this.turnoUsuario = false;
        this.mensaje = gano ? '¡Ganaste! 🎉' : `¡Incorrecto! Tu puntaje fue de ${this.puntaje}`;

        const duracion = (Date.now() - this.inicioJuego) / 1000;

        // Guardar la partida en la base de datos
        try {
            await this.simonService.guardarPartida({
                puntaje: this.puntaje,
                fecha: new Date().toISOString(),
                secuencia: [...this.secuencia],          // Pasar el array completo de colores
                fechaInicio: new Date(this.inicioJuego).toISOString(),
                duracion
            });
        } catch (error) {
            console.error('Error al guardar la partida', error);
        }
    }
}