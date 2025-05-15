


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

    // --- Propiedades del juego ---
    readonly colores: string[] = ['rojo', 'verde', 'azul', 'amarillo', 'naranja', 'violeta', 'negro', 'blanco'];

    secuencia: string[] = [];
    entradaUsuario: string[] = [];
    colorActivo: string | null = null;

    turnoUsuario = false;
    indiceUsuario = 0;
    mensaje = '';
    jugando = false;
    puntaje = 0;

    constructor(
        private simonService: SimonService,
        private authService: AuthService,
        private supabaseService: SupabaseService
    ) {}

    ngOnInit(): void {}

    // --- Lógica del juego ---
    iniciarJuego(): void {
        this.resetearJuego();
        this.agregarColor();
    }

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

    presionarColor(color: string): void {
        if (!this.turnoUsuario) return;

        this.iluminarColor(color);
        this.entradaUsuario.push(color);

        if (color !== this.secuencia[this.indiceUsuario]) {
            this.mensaje = `¡Incorrecto! Tu puntaje fue de ${this.puntaje}`;
            this.jugando = false;
            this.turnoUsuario = false;
            return;
        }

        this.indiceUsuario++;

        if (this.indiceUsuario === this.secuencia.length) {
            this.puntaje++;
            this.turnoUsuario = false;
            setTimeout(() => this.agregarColor(), 1000);
        }
    }


    iluminarColor(color: string) {
        this.colorActivo = color;
        setTimeout(() => this.colorActivo = null, 400);
    }

    getClasesColor(color: string): Record<string, boolean> {
        return {
            [color]: true,
            'activo': this.colorActivo === color
        };
    }
}
