

import { Component, OnInit, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { MatSnackBarModule } from '@angular/material/snack-bar';

import { Subscription, firstValueFrom } from 'rxjs';

import { IMessage } from '../../lib/interfaces';
import { SupabaseService } from '../../services/supabase.service';
import { MessageService } from '../../services/message.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';


@Component({
    selector: 'app-chat',
    imports: [FormsModule, CommonModule, RouterModule, MatSnackBarModule],
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.css'
})



export class ChatComponent implements OnInit, OnDestroy {

    messages: IMessage[] = [];
    newMessage: string = '';
    loading = false;
    error = '';
    private isBrowser: boolean;

    constructor(
        private messageService: MessageService,
        private authService: AuthService
    ) {
        this.isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
    }

    async ngOnInit() {
        if ( this.isBrowser){
            await this.loadMessages();
            this.subscribeToMessages();
        }
    }

    ngOnDestroy(): void {
        if ( this.isBrowser){
            this.messageService.unsubscribeFromMessages();
        }
    }

    private async loadMessages() {
        try {
            this.loading = true;
            this.messages = await this.messageService.getMessages();
        } catch (error: any) {
            this.error = error.message;
            console.error('Error al cargar los mensajes:', error);
        } finally {
            this.loading = false;
        }
        this.scrollToBottom();
    }

    private subscribeToMessages(){
        if (!this.isBrowser) return;
        this.messageService.subscribeToMessages((message: IMessage) => {
            this.messages = [...this.messages, message];
            this.scrollToBottom();
        });
    }


    async sendMessage() {
        if (!this.isBrowser || !this.newMessage.trim()) return;

        try {
            const user = await this.authService.getUserIdMail();
            if (!user) throw new Error('Usuario no Autenticado')
            
            await this.messageService.sendMessage(
                this.newMessage, 
                user.id, 
                user.email
            );

            this.newMessage = '';
        
            this.scrollToBottom();
        } catch (error: any) {
            this.error = error.message;
            console.error('Error al enviar el mensaje:', error);
        }
    }

    formatDate(date: string): string {
        return new Date(date).toLocaleString();
    }

    scrollToBottom() {
        setTimeout(() => {
            const container = document.getElementById('messages-container');
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        }, 100);
    }
}


