

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopJugadoresComponent } from '../../shared/top-jugadores/top-jugadores.component';
import { ActivatedRoute } from '@angular/router';



@Component({
    selector: 'app-resultados',
    standalone: true,
    imports: [CommonModule, TopJugadoresComponent],
    templateUrl: './resultados.component.html',
    styleUrl: './resultados.component.css'
})


export class ResultadosComponent implements OnInit {

    juegoSeleccionado: 'simon' | 'preguntados' | 'mayor-o-menor' | 'ahorcado' = 'simon';

    constructor(private route: ActivatedRoute){}

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            const juegoParam = params['juego'];
            if (['simon', 'preguntados', 'mayor-o-menor', 'ahorcado'].includes(juegoParam)) {
                this.juegoSeleccionado = juegoParam;
            }
        });
    }

    cambiarJuego(juego: typeof this.juegoSeleccionado): void {
        this.juegoSeleccionado = juego;
    }
}
