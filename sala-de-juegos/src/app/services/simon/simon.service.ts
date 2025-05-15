

import { Injectable } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';
import { AuthService } from '../auth/auth.service';
import { IPartidaSimon } from '../../lib/interfaces';

@Injectable({
  providedIn: 'root'
})




export class SimonService {

  constructor(
        private supabaseService: SupabaseService,
        private authService: AuthService
    ) {}

    async guardarPartida(partida: IPartidaSimon): Promise<void> {
      let userId: string | null = null;

      try {
        const { id } = await this.authService.getUserIdMail();
        userId = id;
      } catch {
        // No logueado
      }

      const datosAGuardar = {
        user_id: userId,
        puntaje: partida.puntaje,
        fecha: partida.fecha,
        secuencia: partida.secuencia,       // Ahora un array string[]
        fecha_inicio: partida.fechaInicio,  // Ojo, campo en DB snake_case
        duracion: Math.floor(partida.duracion)  // entero en segundos
    };

      const { error } = await this.supabaseService.client
        .from('partidas_simon')
        .insert([datosAGuardar]);

      if (error) {
        throw error;
      }
    }
}
