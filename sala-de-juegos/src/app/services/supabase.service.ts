

import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, AuthSession } from '@supabase/supabase-js'; // Importa los tipos y funciones necesarias de Supabase
import { environment } from '../enviroments/enviroment'; // Importa las variables de entorno (URL y clave del proyecto de Supabase)


@Injectable({
    providedIn: 'root' // Hace que este servicio esté disponible a nivel global en la app
})


export class SupabaseService {

    private supabase: SupabaseClient; // Cliente de Supabase para conectarse al backend
    private _session: AuthSession | null = null; // Almacena la sesión de autenticación actual (si existe)

    constructor() {
        this.supabase = createClient(
            environment.supabaseUrl,
            environment.supabaseKey
        ); // Crea el cliente de Supabase usando las variables de entorno

        this.loadSession(); // Carga la sesión almacenada (si existe)
    }

    /**
     * Método privado para cargar la sesión actual del usuario desde Supabase
     */
    private async loadSession() {
        const { data: { session } } = await this.supabase.auth.getSession();
        this._session = session;
    }


    /**
     * Getter para acceder a la sesión actual
     */
    get session() {
        return this._session;
    }
    
    /**
     * Indica si el usuario está logueado
     */
    get isLoggedIn(): boolean {
        return !!this._session;
    }


    /**
     * Iniciar sesión con nombre de usuario y contraseña
     * 1. Busca el email correspondiente al nombre de usuario
     * 2. Inicia sesión con email y contraseña
     * @param username - Nombre de usuario
     * @param password - Contraseña
     */
    async signIn(username: string, password: string) {

        // Buscar el email en la tabla 'usuarios' usando el username
        const { data: userData, error: userError } = await this.supabase
            .from('usuarios')
            .select('email')
            .eq('username', username)
            .single(); // Espera un único resultado
        
        if (userError || !userData) {
            throw new Error('Usuario no encontrado');
        }
    
        // Usar el email recuperado para hacer login
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email: userData.email,
            password
        });
        
        if (error) throw error;

        this._session = data.session; // Guardar sesión actual
        return data;
    }
    


    /**
     * Registro de nuevo usuario
     * 1. Registra en el sistema de autenticación
     * 2. Guarda datos adicionales en tabla 'usuarios'
     * @param email - Correo electrónico
     * @param password - Contraseña
     * @param username - Nombre de usuario personalizado
     */
    async signUp(email: string, password: string, username: string) {
        
        // Registrar usuario en sistema de autenticación de Supabase
        const { data: authData, error: authError } = await this.supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username // Se guarda también en metadatos
                }
            }
        });
        
        if (authError) throw authError;
    
        // Insertar usuario en la tabla 'usuarios' con info adicional
        const { error: dbError } = await this.supabase
            .from('usuarios')
            .insert({
                id: authData.user?.id, // Usa el ID generado por Supabase Auth
                username: username,
                email: email
            });
        
        if (dbError) throw dbError;
        
        return authData;
    }

    /**
     * Cierra la sesión del usuario
     */
    async signOut() {
        const { error } = await this.supabase.auth.signOut();
        this._session = null;
        if (error) throw error;
    }

    /**
     * Devuelve el nombre de usuario del usuario logueado
     * @returns username o null si no está logueado
     */
    async getCurrentUsername(): Promise<string | null> {
        if (!this._session?.user?.id) return null;
        
        // Busca el username en la tabla 'usuarios' por ID
        const { data, error } = await this.supabase
            .from('usuarios')
            .select('username')
            .eq('id', this._session.user.id)
            .single();
        
        if (error) return null;
        return data.username;
    }

    async registerUser(user: { username: string, password: string, email: string, phone: string }) {
        return await this.supabase
            .from('users')
            .insert([user]);
    }

}
