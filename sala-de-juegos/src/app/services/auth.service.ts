

import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { BehaviorSubject } from 'rxjs';



@Injectable({
    providedIn: 'root'
})


export class AuthService {

    authStatus$ = new BehaviorSubject<boolean>(false);

    constructor(private supabaseService: SupabaseService) {}

    async loginWithUsername(username: string, password: string) {
        const supabase = this.supabaseService.client;

        const { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('email')
            .eq('username', username)
            .single();

        if (fetchError || !userData?.email) {
            return { error: { message: 'Usuario no encontrado' } };
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email: userData.email,
            password,
        });

        if (data?.session) this.authStatus$.next(true);
        return { data, error };
    }

    async logout(): Promise<void> {
        await this.supabaseService.client.auth.signOut();
        this.authStatus$.next(false);
    }

    async getUser() {
        return await this.supabaseService.client.auth.getUser();
    }

    async checkAuthStatus() {
        const { data } = await this.supabaseService.client.auth.getSession();
        this.authStatus$.next(!!data?.session?.user);
    }

    async isLoggedIn(): Promise<boolean> {
        const { data } = await this.supabaseService.client.auth.getSession();
        return !!data.session;
    }

}
