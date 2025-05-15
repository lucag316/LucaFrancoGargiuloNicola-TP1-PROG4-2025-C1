import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';
import { AuthService } from '../auth/auth.service';
import { IGameResult } from '../../lib/interfaces';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})



export class GamesService {

  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

/**
   * Guarda el resultado de una partida en Supabase.
   * Solo lo intenta si se está ejecutando en el navegador (no en SSR).
   * 
   * @param result Objeto con los datos del resultado del juego
   */
  async saveGameResult(result: IGameResult): Promise<void>{
    if(!isPlatformBrowser(this.platformId)) return;
    const { error } = await this.supabaseService.client
      .from('game_results')
      .insert(result);

    if (error) throw error
  }

  /**
   * Obtiene los resultados del usuario logueado desde la base de datos.
   * Puede filtrar por tipo de juego.
   * 
   * @param userId ID del usuario autenticado
   * @param gameType Tipo de juego (opcional)
   * @returns Lista de resultados de partidas
   */
  async getGameResults(userId: string, gameType?: string): Promise<IGameResult[]> {
    let query = this.supabaseService.client
      .from('game_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (gameType) {
      query = query.eq('game_type', gameType);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  }


}
