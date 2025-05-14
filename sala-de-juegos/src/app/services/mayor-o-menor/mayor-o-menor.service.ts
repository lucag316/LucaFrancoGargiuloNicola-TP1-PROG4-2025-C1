
import { Injectable } from '@angular/core';
import { SupabaseService } from '../supabase.service';
import { AuthService } from '../auth.service';
import { ICarta } from '../../lib/interfaces';




@Injectable({
    providedIn: 'root'
})



export class MayorOMenorService {


    constructor(
        private supabaseService: SupabaseService,
        private authService: AuthService
    ) { }


    
    generarMazo(): ICarta[] {

        const valores: Record<number, string> = {
            1: 'A',
            11: 'J',
            12: 'Q',
            13: 'K'
        };

        const palos: ICarta['palo'][] = ['hearts', 'diamonds', 'clubs', 'spades'];
        const mazo: ICarta[] = [];

        for (const palo of palos) {
            for (let valor = 1; valor <= 13; valor++) {
                const nombreValor = valores[valor] || valor.toString(); // A, 2–10, J, Q, K
                const imagen = `assets/cartas/${nombreValor}_of_${palo}.png`;
                mazo.push({ palo, valor, imagen });
            }
        }

        return this.shuffle(mazo);
    }


    private shuffle(mazo: ICarta[]): ICarta[] {
        for (let i = mazo.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [mazo[i], mazo[j]] = [mazo[j], mazo[i]];
        }
        return mazo;
    }



    async guardarPartida(puntaje: number): Promise<void> {
        let userId: string | null = null;

        try {
            const { id } = await this.authService.getUserIdMail();
            userId = id;
        } catch {
            // Si no está logueado, queda como null
        }

        const datosAGuardar = {
            user_id: userId,
            puntaje,
            fecha: new Date().toISOString()
        };

        const { error } = await this.supabaseService.client
            .from('partidas_mayor_o_menor')
            .insert([datosAGuardar]);

        if (error) {
            throw error;
        }
    }

}
