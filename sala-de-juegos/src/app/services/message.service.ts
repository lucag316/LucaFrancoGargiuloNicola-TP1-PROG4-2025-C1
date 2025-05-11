import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { IMessage } from '../lib/interfaces';



@Injectable({
    providedIn: 'root'
})


export class MessageService {

    private messagesSubject = new BehaviorSubject<IMessage[]>([]);
    public messages$ = this.messagesSubject.asObservable();

    constructor(private supabaseService: SupabaseService) {}

    async loadInitialMessages(): Promise<void> {
        const { data, error } = await this.supabaseService.client
            .from('messages')
            .select('*')
            .order('timestamp', { ascending: true });

        if (error) {
            console.error('Error al cargar mensajes iniciales:', error);
            return;
        }

        this.messagesSubject.next(data as IMessage[]);
    }

    async sendMessage(username: string, message: string): Promise<void> {
        const { error } = await this.supabaseService.client
            .from('messages')
            .insert([{ username, message }]);

        if (error) throw error;
    }

    listenForMessages(): void {
        this.supabaseService.client
            .channel('public:messages')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages' },
                (payload) => {
                const currentMessages = this.messagesSubject.getValue();
                this.messagesSubject.next([...currentMessages, payload.new as IMessage]);
                }
            )
        .subscribe();
    }
}
