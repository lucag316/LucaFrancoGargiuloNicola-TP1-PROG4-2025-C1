
// ==========================================================================
// Componente: ChatComponent
// Descripción:
//   Componente de chat en tiempo real. Muestra los mensajes cargados desde 
//   Supabase, permite enviar nuevos, y se suscribe a nuevos mensajes 
//   usando sockets o listeners en tiempo real.
// ==========================================================================

import { Component, OnInit, OnDestroy, PLATFORM_ID, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { MatSnackBarModule } from '@angular/material/snack-bar';

import { Subscription, firstValueFrom } from 'rxjs';

import { IMessage } from '../../../lib/interfaces';
import { SupabaseService } from '../../../services/supabase/supabase.service';
import { MessageService } from '../../../services/chat/message.service';
import { UserService } from '../../../services/user/user.service';
import { AuthService } from '../../../services/auth/auth.service';


@Component({
    selector: 'app-chat',
    imports: [FormsModule, CommonModule, RouterModule, MatSnackBarModule],
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.css'
})



export class ChatComponent implements OnInit, OnDestroy {

    // ================================================================
    // PROPIEDADES DEL COMPONENTE
    // ================================================================

    messages: IMessage[] = [];           // Lista de mensajes del chat
    newMessage: string = '';             // Mensaje en el input
    loading = false;                     // Indicador de carga
    error = '';                          // Mensaje de error (si ocurre)
    currentUserName: string = '';       // Email del usuario actual
    private isBrowser: boolean;          // Flag para detectar ejecución en el navegador

    // Referencia al contenedor de mensajes para hacer scroll automático
    @ViewChild('messageContainer') messageContainer!: ElementRef; 

    constructor(
        private messageService: MessageService,
        private authService: AuthService
    ) {
        this.isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
    }

    // ================================================================
    // MÉTODO: ngOnInit
    // ------------------------------------------------
    // Obtiene el email del usuario, carga mensajes y se suscribe a nuevos
    // ================================================================
    async ngOnInit() {
        if (!this.isBrowser) return;

        try {
            const user = await this.authService.getUserInfo();
            this.currentUserName = user.username;
        await this.loadMessages();
            this.subscribeToMessages();
        } catch (err) {
            this.error = 'Error al inicializar el chat.';
            console.error(err);
        }
    }

    ngOnDestroy(): void {
        if ( this.isBrowser){
            this.messageService.unsubscribeFromMessages();
        }
    }

    // ================================================================
    // MÉTODO: loadMessages
    // ------------------------------------------------
    // Carga todos los mensajes desde Supabase
    // ================================================================
    private async loadMessages() {
        try {
            this.loading = true;
            this.messages = await this.messageService.getMessages();
        } catch (error: any) {
            this.error = error.message;
            console.error('Error al cargar los mensajes:', error);
        } finally {
            this.loading = false;
            this.scrollToBottom();
        }
    }

    // ================================================================
    // MÉTODO: subscribeToMessages
    // ------------------------------------------------
    // Se suscribe a nuevos mensajes en tiempo real
    // ================================================================
    private subscribeToMessages(){
        if (!this.isBrowser) return;

        this.messageService.subscribeToMessages((message: IMessage) => {
            this.messages = [...this.messages, message];
            this.scrollToBottom();
        });
    }


    // ================================================================
    // MÉTODO: sendMessage
    // ------------------------------------------------
    // Envía un nuevo mensaje al chat y lo limpia del input
    // ================================================================
    async sendMessage() {
        if (!this.isBrowser || !this.newMessage.trim()) return;

        try {
            const user = await this.authService.getUserInfo();
            if (!user) throw new Error('Usuario no Autenticado')
            
            await this.messageService.sendMessage(
                this.newMessage, 
                user.id, 
                user.username,
            );

            this.newMessage = '';
        
            this.scrollToBottom();
        } catch (error: any) {
            this.error = error.message;
            console.error('Error al enviar el mensaje:', error);
        }
    }

    // ================================================================
    // MÉTODO: formatDate
    // ------------------------------------------------
    // Formatea la fecha del mensaje en formato legible
    // ================================================================
    formatDate(date: string): string {
        return new Date(date).toLocaleString(); // ej: 16/05/2025, 22:45
    }

    // ================================================================
    // MÉTODO: scrollToBottom
    // ------------------------------------------------
    // Desplaza el contenedor al último mensaje
    // ================================================================
    scrollToBottom() {
        if (this.messageContainer) {
            setTimeout(() => {
                this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
            }, 100);
        }
    }
}


