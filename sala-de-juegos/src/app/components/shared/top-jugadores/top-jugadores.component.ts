
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../services/supabase/supabase.service';




@Component({
    selector: 'app-top-jugadores',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './top-jugadores.component.html',
    styleUrl: './top-jugadores.component.css'
})



export class TopJugadoresComponent implements OnInit, OnChanges {

    @Input() juego: 'simon' | 'preguntados' | 'mayor-o-menor' | 'ahorcado' = 'simon';
    top10: any[] = [];
    cargando = true;


    constructor(private supabaseService: SupabaseService) { }

    ngOnInit() {
        this.cargarTop10();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['juego']) {
            this.cargarTop10();
        }
    }

    async cargarTop10() {
        this.cargando = true;

        const tabla = {
            'simon': 'partidas_simon',
            'preguntados': 'partidas_preguntados',
            'mayor-o-menor': 'partidas_mayor_o_menor',
            'ahorcado': 'partidas_ahorcado'
            }[this.juego];

        if (!tabla) return;

        const { data, error } = await this.supabaseService.client
            .from(tabla)
            .select(
                'usuario:users!user_id(username), puntaje, fecha')
            .order('puntaje', { ascending: false })
            .limit(10);

        if (!error) {
            this.top10 = data;
        } else {
            console.error('Error cargando top:', error.message);
            this.top10 = [];
        }

        this.cargando = false;
    }
}
