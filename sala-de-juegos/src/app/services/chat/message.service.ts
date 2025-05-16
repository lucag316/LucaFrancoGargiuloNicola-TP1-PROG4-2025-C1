
// ==========================================================================
// Servicio: MessageService
// Descripción:
//   Servicio encargado de gestionar la lógica de mensajes del chat:
//   - Obtener mensajes desde Supabase
//   - Suscribirse a nuevos mensajes en tiempo real
//   - Enviar mensajes
//   - Cancelar la suscripción
// ==========================================================================

import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { BehaviorSubject } from 'rxjs';
import { SupabaseService } from '../supabase/supabase.service';
import { IMessage } from '../../lib/interfaces';
import { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';



@Injectable({
    providedIn: 'root'
})


export class MessageService {

    // Canal de escucha en tiempo real (INSERT en tabla messages)
    private channel: RealtimeChannel | null = null;

    // Para evitar ejecuciones en SSR o Angular Universal
    private isBrowser: boolean;

    // private messagesSubject = new BehaviorSubject<IMessage[]>([]);
    // public messages$ = this.messagesSubject.asObservable();


    constructor(private supabaseService: SupabaseService) {
        this.isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
    }



    // ==========================================================================
    // MÉTODO: getMessages
    // ----------------------------------------
    // Obtiene todos los mensajes ordenados por timestamp (ascendente)
    // ==========================================================================
    async getMessages(): Promise<IMessage[]> {
        if (!this.isBrowser) return [];

        const { data, error } =  await this.supabaseService.client
            .from('messages')
            .select('*')
            .order('timestamp', { ascending: true });

        if (error) throw error
        return data as IMessage[];
        
    }


    // ==========================================================================
    // MÉTODO: subscribeToMessages
    // ----------------------------------------
    // Se suscribe a inserciones nuevas en la tabla 'messages' y ejecuta el callback
    // con el nuevo mensaje recibido.
    // ==========================================================================
    subscribeToMessages(callback: (messages: IMessage) => void): void {
        if (!this.isBrowser) return;

        this.channel = this.supabaseService.client
            .channel('public:messages')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'messages' },
                (payload) => {
                    if(payload.eventType === 'INSERT') {
                        callback(payload.new as IMessage);
                    }
                }
            )
            .subscribe();
    }


    // ==========================================================================
    // MÉTODO: unsubscribeFromMessages
    // ----------------------------------------
    // Cancela la suscripción al canal de mensajes.
    // ==========================================================================
    unsubscribeFromMessages(): void {
        if (!this.isBrowser) return;
        this.channel?.unsubscribe();
    }


    // ==========================================================================
    // MÉTODO: sendMessage
    // ----------------------------------------
    // Inserta un nuevo mensaje en la tabla de Supabase
    // ==========================================================================
    async sendMessage(message: string, userId: string, userName: string) : Promise<void>{
        if (!this.isBrowser) return;

        const { error } = await this.supabaseService.client
            .from('messages')
            .insert({ 
                message: message.trim(), 
                user_id: userId,
                user_name: userName
            });
        if (error) throw error
    }


}
