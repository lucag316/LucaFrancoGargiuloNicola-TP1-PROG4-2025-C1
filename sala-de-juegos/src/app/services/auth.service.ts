

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { SupabaseService } from './supabase.service';



@Injectable({
    providedIn: 'root'
})


export class AuthService {

    /**
   * Observable para notificar si el usuario está autenticado o no.
   * Se puede suscribir desde componentes para mostrar contenido condicionalmente.
   */
    authStatus$ = new BehaviorSubject<boolean>(false);

    constructor(private supabaseService: SupabaseService) {}

    // Método para obtener el estado actual de autenticación (sin necesidad de suscripción)
    getCurrentAuthStatus(): boolean {
        return this.authStatus$.getValue();
    }

    /**
   * Realiza el inicio de sesión utilizando username y password.
   * Primero busca el email asociado al username en la tabla 'users',
   * y luego intenta autenticar usando Supabase con ese email.
   * 
   * @param username Nombre de usuario
   * @param password Contraseña del usuario
   * @returns Objeto con data o error
   */
    async loginWithUsername(username: string, password: string) {
        const supabase = this.supabaseService.client;

        // Buscar email asociado al username
        const { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('email')
            .eq('username', username)
            .single();

        if (fetchError || !userData?.email) {
            return { error: { message: 'Usuario no encontrado' } };
        }

        // Intentar autenticar usando el email encontrado
        const { data, error } = await supabase.auth.signInWithPassword({
            email: userData.email,
            password,
        });

        // Si inicia sesión correctamente, notificamos a los observadores
        if (data?.session) this.authStatus$.next(true);

        return { data, error };
    }


    /**
   * Cierra la sesión actual.
   * También actualiza el estado de autenticación (authStatus$).
   */
    async logout(): Promise<void> {
        await this.supabaseService.client.auth.signOut();
        this.authStatus$.next(false);
    }


    /**
   * Devuelve los datos del usuario autenticado actual.
   * @returns Información del usuario (si hay sesión activa)
   */
    async getUser() {
        return await this.supabaseService.client.auth.getUser();
    }


    /**
   * Verifica si hay una sesión activa y actualiza authStatus$ en consecuencia.
   * Puede usarse al cargar la app o al refrescar la página.
   */
    async checkAuthStatus() {
        const { data } = await this.supabaseService.client.auth.getSession();
        this.authStatus$.next(!!data?.session?.user);
    }


    /**
   * Devuelve `true` si el usuario tiene una sesión activa, `false` en caso contrario.
   * @returns Booleano indicando si el usuario está logueado
   */
    async isLoggedIn(): Promise<boolean> {
        const { data } = await this.supabaseService.client.auth.getSession();
        return !!data.session;
    }

    // Devuelve el ID del usuario autenticado
    async getUserId(): Promise<string> {
        const { data } = await this.supabaseService.client.auth.getUser();
        return data?.user?.id ?? ''; // No devolverá null, ya que sabemos que el usuario está autenticado
    }
}
