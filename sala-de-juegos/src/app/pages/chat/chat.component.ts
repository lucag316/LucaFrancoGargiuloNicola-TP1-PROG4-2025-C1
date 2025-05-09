

import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { MatSnackBarModule } from '@angular/material/snack-bar';

import { Subscription } from 'rxjs';

import { IMessage } from '../../lib/interfaces';
import { SupabaseService } from '../../services/supabase.service';



@Component({
    selector: 'app-chat',
    imports: [FormsModule, CommonModule, RouterModule, MatSnackBarModule],
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.css'
})



export class ChatComponent implements OnInit {

    messages: IMessage[] = [];
    newMessage: string = '';
    currentUsername: string = '';

    private messagesSub!: Subscription;

    constructor(private supabaseService: SupabaseService) {}

    async ngOnInit(): Promise<void> {
        // Obtener nombre de usuario desde metadata
        const { data: userData } = await this.supabaseService.getUser();
        console.log(userData); // Verificar la respuesta de getUser()
        this.currentUsername = userData?.user?.user_metadata?.['username'] || '';

        // Cargar mensajes ya existentes
        await this.supabaseService.loadInitialMessages();

        // Suscribirse a los mensajes
        this.messagesSub = this.supabaseService.messages$.subscribe((msgs) => {
            this.messages = msgs;
        });

        // Escuchar en tiempo real nuevos mensajes
        this.supabaseService.listenForMessages();
    }

    async sendMessage(): Promise<void> {
        const trimmed = this.newMessage.trim();
        if (!trimmed) return;

        try {
            // Enviar ambos parámetros: username y message
            await this.supabaseService.sendMessage(this.currentUsername, trimmed);
            this.newMessage = '';
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
        }
    }
    ngOnDestroy(): void {
        this.messagesSub?.unsubscribe();
    }
}