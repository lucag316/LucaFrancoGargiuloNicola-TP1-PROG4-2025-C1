

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { IUser } from '../lib/interfaces';

@Injectable({
    providedIn: 'root'
})



export class UserService {


    private users = new BehaviorSubject<IUser[]>([]);
    users$ = this.users.asObservable();
    private initialized = false;

    constructor(private supabaseService: SupabaseService) {
        this.initialize();
    }

    async initialize() {
        if (this.initialized) return;

        try {
            const { error } = await this.supabaseService.client
                .from('users')
                .select('count')
                .limit(0);
            if (error) throw error;

            await this.getUsers();
            this.initialized = true;
        } catch (error) {
            this.users.error(error);
        }
    }

    private async getUsers() {
        try {
            const { data, error } = await this.supabaseService.client
                .from('users')
                .select('*');
            if (error) throw error;
            this.users.next(data || []);
        } catch (error) {
            this.users.error(error);
        }
    }

    async register(user: Omit<IUser, 'id' | 'created_at'>): Promise<void> {
        const supabase = this.supabaseService.client;

        const { data: existingUsername } = await supabase
            .from('users')
            .select('id')
            .eq('username', user.username)
            .single();
        if (existingUsername) throw new Error('Usuario ya registrado.');

        const { data: existingEmail } = await supabase
            .from('users')
            .select('id')
            .eq('email', user.email)
            .single();
        if (existingEmail) throw new Error('Email ya registrado.');

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: user.email,
            password: user.password,
        });
        if (authError || !authData?.user)
            throw new Error(authError?.message || 'Error al registrar en Auth');

        const { error: insertError } = await supabase
            .from('users')
            .insert([{ username: user.username, email: user.email, phone: user.phone }]);
        if (insertError) throw new Error(insertError.message);

        await this.getUsers();
    }

    async deleteUserAccount(userId: string): Promise<void> {
        const supabase = this.supabaseService.client;
        const { error: deleteError } = await supabase
            .from('users')
            .delete()
            .eq('id', userId);
        if (deleteError) throw deleteError;

        await supabase.auth.signOut();
        localStorage.removeItem('supabase.auth.token');
        sessionStorage.removeItem('supabase.auth.token');
    }
}
