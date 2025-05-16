

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { SupabaseService } from '../supabase/supabase.service';
import { IUser } from '../../lib/interfaces';

/**
 * Servicio centralizado para la gestión de usuarios.
 * 
 * Este servicio se encarga de:
 * - Consultar y mantener la lista de usuarios desde Supabase.
 * - Registrar nuevos usuarios (autenticación y datos personalizados).
 * - Eliminar usuarios (tanto de la base como cerrar sesión).
 * 
 * Utiliza un BehaviorSubject para exponer la lista de usuarios de forma reactiva.
 */
@Injectable({
    providedIn: 'root'
})

export class UserService {

    /** Subject reactivo que mantiene y emite la lista actual de usuarios */
    private users = new BehaviorSubject<IUser[]>([]);

    /** Observable público que permite suscribirse a la lista de usuarios */
    users$ = this.users.asObservable();

    /** Bandera para evitar múltiples inicializaciones */
    private initialized = false;

    constructor(private supabaseService: SupabaseService) {
        this.initialize(); // Carga inicial
    }

    /**
   * Inicializa el servicio al verificar la existencia de la tabla 'users'
   * y luego realiza la primera carga de usuarios.
   */
    async initialize(): Promise<void> {
        if (this.initialized) return;  // Evita reinicializar

        try {
            // Verifica que la tabla 'users' exista en Supabase
            const { error } = await this.supabaseService.client
                .from('users')
                .select('count')
                .limit(0); // No devuelve datos, solo chequea existencia

            if (error) throw error;

            await this.getUsers(); // Carga inicial de usuarios
            this.initialized = true;

        } catch (error) {
            this.users.error(error); // Notifica error en el observable
        }
    }

    /**
   * Consulta todos los registros de la tabla 'users' y actualiza el observable.
   */
    private async getUsers(): Promise<void> {
        try {
            const { data, error } = await this.supabaseService.client
                .from('users')
                .select('*');

            if (error) throw error;

            this.users.next(data || []); // Emite los usuarios obtenidos

        } catch (error) {
            this.users.error(error);
        }
    }

    /**
   * Registra un nuevo usuario tanto en Supabase Auth como en la tabla 'users'.
   * 
   * @param user Objeto con los datos del usuario a registrar (sin ID ni created_at).
   * @throws Error si el email o username ya están registrados, o si falla el registro.
   */
    async register(user: Omit<IUser, 'id' | 'created_at'>): Promise<void> {
        const supabase = this.supabaseService.client;

        // Verifica si ya existe un usuario con ese username
        const { data: existingUsername } = await supabase
            .from('users')
            .select('id')
            .eq('username', user.username)
            .single();

        if (existingUsername) throw new Error('Nombre de usuario ya registrado.');

        // Verifica si ya existe un usuario con ese email
        const { data: existingEmail } = await supabase
            .from('users')
            .select('id')
            .eq('email', user.email)
            .single();

        if (existingEmail) throw new Error('Email ya registrado.');

        // Registro en Supabase Auth (para login)
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: user.email,
            password: user.password,
        });
        if (authError || !authData?.user)
            throw new Error(authError?.message || 'Error al registrar en Auth');

        // Inserción en la tabla 'users' con el ID de Supabase Auth
        const { error: insertError } = await supabase
            .from('users')
            .insert([{ 
                id: authData.user.id, 
                username: user.username, 
                email: user.email, 
                phone: user.phone 
            }]);

        if (insertError) throw new Error(insertError.message);

        // Recarga la lista de usuarios después del registro
        await this.getUsers(); 
    }

    /**
   * Elimina un usuario de la tabla 'users' y cierra su sesión de Supabase Auth.
   * @param userId ID del usuario a eliminar (generalmente obtenido desde Supabase Auth).
   */
    async deleteUserAccount(userId: string): Promise<void> {
        const supabase = this.supabaseService.client;

        // Elimina el usuario de la tabla
        const { error: deleteError } = await supabase
            .from('users')
            .delete()
            .eq('id', userId);

        if (deleteError) throw deleteError;

        // Cierra sesión y limpia tokens locales
        await supabase.auth.signOut();
        localStorage.removeItem('supabase.auth.token');
        sessionStorage.removeItem('supabase.auth.token');
    }
}
