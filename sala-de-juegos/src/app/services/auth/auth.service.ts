
// ========================================================
// Servicio: AuthService
// Descripción:
//   Gestiona toda la lógica de autenticación del usuario
//   utilizando Supabase. Maneja el login, logout, estado
//   de sesión, y acceso a datos del usuario actual.
// ========================================================

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { SupabaseService } from '../supabase/supabase.service';
import { IUser } from '../../lib/interfaces';


@Injectable({
    providedIn: 'root'
})


export class AuthService {

    // ========================================================
    // Observable: authStatus$
    // --------------------------------------------------------
    // Permite a los componentes suscribirse para saber si el
    // usuario está autenticado (true) o no (false).
    // ========================================================
    authStatus$ = new BehaviorSubject<boolean>(false);

    constructor(private supabaseService: SupabaseService) {}

    // ========================================================
    // Método: getCurrentAuthStatus
    // --------------------------------------------------------
    // Devuelve el estado actual de autenticación (sin suscripción).
    // Útil para evaluaciones rápidas en componentes.
    // ========================================================
    getCurrentAuthStatus(): boolean {
        return this.authStatus$.getValue();
    }

    // ========================================================
    // Método: loginWithUsername
    // --------------------------------------------------------
    // Realiza el inicio de sesión usando un nombre de usuario.
    // 1. Busca el email asociado al username en la tabla 'users'.
    // 2. Usa ese email para autenticar vía Supabase.
    // 3. Actualiza el estado de autenticación si es exitoso.
    //
    // @param username - nombre de usuario
    // @param password - contraseña
    // @returns objeto con { data, error }
    // ========================================================
    async loginWithUsername(username: string, password: string) {
        const supabase = this.supabaseService.client;

        // Buscar email asociado al username
        const { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('email')
            .eq('username', username)
            .single();

            // Si no se encontró el usuario
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


    // ========================================================
    // Método: logout
    // --------------------------------------------------------
    // Cierra la sesión del usuario actual y actualiza el
    // estado de autenticación global.
    // ========================================================
    async logout(): Promise<void> {
        await this.supabaseService.client.auth.signOut();
        this.authStatus$.next(false);
    }


    // ========================================================
    // Método: getUser
    // --------------------------------------------------------
    // Obtiene los datos del usuario actualmente autenticado.
    //
    // @returns objeto con información del usuario o null
    // ========================================================
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

    // ========================================================
    // Método: getUserIdMail
    // --------------------------------------------------------
    // Devuelve el ID y email del usuario autenticado.
    //
    // @returns objeto con { id, email } o lanza error
    // ========================================================
    async getUserIdMail(): Promise<Pick<IUser, 'id' | 'email'>> {
        const { data, error } = await this.supabaseService.client.auth.getUser();
        
        if (error || !data?.user || !data.user.email) {
            throw new Error('No hay usuario autenticado o el email no está disponible');
        }

        return {
            id: data.user.id,
            email: data.user.email
        };
    }
}
