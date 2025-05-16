
import { Injectable } from '@angular/core';

import { SupabaseService } from '../supabase/supabase.service';
import { AuthService } from '../auth/auth.service';


@Injectable({
    providedIn: 'root'
})


export class AhorcadoService {

    constructor(
        private supabaseService: SupabaseService,
        private authService: AuthService
    ) { }

    /**
   * Método para guardar los datos de la partida en Supabase.
   * @param partida Objeto con los datos de la partida
   */
    async guardarPartida(partida: {
        palabra: string;
        letras_usadas: string[];
        intentos: number;
        resultado: 'ganó' | 'perdió';
        fecha: string;
    }) {
        // Utilizando getUserIdMail para obtener id y email
        const { id: userId } = await this.authService.getUserInfo(); // Obtenemos solo el id


        // Añadimos el user_id al objeto partida
        const partidaConUsuario = {
            ...partida,
            user_id: userId, // Añadir el ID del usuario
        };

        try {
            await this.supabaseService.client
                .from('partidas_ahorcado')
                .insert([partidaConUsuario]);
            console.log('Partida guardada exitosamente');
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error al guardar la partida:', error.message);
                throw new Error(`Error al guardar la partida: ${error.message}`);
            } else {
                console.error('Error inesperado:', error);
                throw new Error('Error inesperado al guardar la partida');
            }
        }
    }
}
