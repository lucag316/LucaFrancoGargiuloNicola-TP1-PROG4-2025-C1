
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { MayorOMenorService } from '../../../services/mayor-o-menor/mayor-o-menor.service';
import { AuthService } from '../../../services/auth.service';
import { SupabaseService } from '../../../services/supabase.service';

import { ICarta } from '../../../lib/interfaces';


@Component({
    selector: 'app-mayor-o-menor',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './mayor-o-menor.component.html',
    styleUrl: './mayor-o-menor.component.css'
})



export class MayorOMenorComponent implements OnInit {

    mazo: ICarta[] = [];
    cartaActual!: ICarta;
    cartaSiguiente!: ICarta;
    mensaje: string = '';
    juegoTerminado: boolean = false;

    racha: number = 0;
    puntaje: number = 0;


    constructor(
        router: Router,
        private mayorOMenorService: MayorOMenorService,
        private authService: AuthService,
        private supabaseService: SupabaseService
    ){
    }


    ngOnInit(): void {
        this.iniciarJuego();
    }

    iniciarJuego() {
        this.mazo = this.mayorOMenorService.generarMazo();
        this.cartaActual = this.mazo.pop()!;
        this.cartaSiguiente = this.mazo.pop()!;
        this.juegoTerminado = false;
        this.racha = 0;
        this.puntaje = 0;
        this.mensaje = '';
    }




    elegir(opcion: 'mayor' | 'menor') {
        if (this.juegoTerminado) return;

        const valorActual = this.cartaActual.valor;
        const valorSiguiente = this.cartaSiguiente.valor;

        const acerto =
            (opcion === 'mayor' && valorSiguiente > valorActual) ||
            (opcion === 'menor' && valorSiguiente < valorActual);

        if (acerto) {
            this.racha++;
            this.puntaje = this.racha * 10;
            this.cartaActual = this.cartaSiguiente;

            if (this.mazo.length > 0) {
                this.cartaSiguiente = this.mazo.pop()!;
            } else {
                this.mensaje = '¡Ganaste! Te quedaste sin cartas 🎉';
                this.guardarPartida(true);
                this.juegoTerminado = true;
            }
        } else {
            this.mensaje = `Perdiste 😢. Tu racha fue de ${this.racha}`;
            this.guardarPartida(false);
            this.juegoTerminado = true;
        }
    }


    async guardarPartida(gano: boolean) {
        const partida = {
            intentos: this.racha,
            resultado: gano ? 'ganó' : 'perdió',
            fecha: new Date().toISOString(),
            puntaje: this.puntaje
        };

        try {
            await this.mayorOMenorService.guardarPartida(this.puntaje);
        } catch (error) {
            console.error('Error al guardar la partida', error);
        }
    }

    reiniciar() {
        this.iniciarJuego();
    }

}
