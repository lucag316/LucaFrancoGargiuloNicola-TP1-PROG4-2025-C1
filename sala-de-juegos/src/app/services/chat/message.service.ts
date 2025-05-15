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

    private channel: RealtimeChannel | null = null;
    private isBrowser: boolean;

    // private messagesSubject = new BehaviorSubject<IMessage[]>([]);
    // public messages$ = this.messagesSubject.asObservable();


    constructor(private supabaseService: SupabaseService) {
        this.isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
    }



    async getMessages(): Promise<IMessage[]> {
        if (!this.isBrowser) return [];

        const { data, error } =  await this.supabaseService.client
            .from('messages')
            .select('*')
            .order('timestamp', { ascending: true });

        if (error) throw error
        return data as IMessage[];
        
    }


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


    unsubscribeFromMessages(): void {
        if (!this.isBrowser) return;
        this.channel?.unsubscribe();
    }



    async sendMessage(message: string, userId: string, userEmail: string ) : Promise<void>{
        if (!this.isBrowser) return;

        const { error } = await this.supabaseService.client
            .from('messages')
            .insert({ 
                message: message.trim(), 
                user_id: userId, 
                user_email: userEmail 
            });
        if (error) throw error
    }


}
