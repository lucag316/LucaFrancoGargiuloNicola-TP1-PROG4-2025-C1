
import { Injectable } from '@angular/core';

import { SupabaseService } from '../supabase/supabase.service';
import { AuthService } from '../auth/auth.service';
import { IPartidaAhorcado } from '../../lib/interfaces';


@Injectable({
    providedIn: 'root'
})


export class AhorcadoService {

    constructor(
        private supabaseService: SupabaseService,
        private authService: AuthService
    ) { }

    /**
   * Guarda una partida de Ahorcado en Supabase.
   *
   * Esta función intenta obtener el ID del usuario actual (si está autenticado)
   * y guarda los datos de la partida en la tabla `partidas_ahorcado`.
   * Si el usuario no está logueado, el campo `user_id` será null.
   *
   * @param partida Datos de la partida (sin user_id, que se añade automáticamente)
   * @throws Error si ocurre un problema al guardar en Supabase
   */
    async guardarPartida(partida: IPartidaAhorcado): Promise<void> {

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
