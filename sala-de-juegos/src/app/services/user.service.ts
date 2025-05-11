

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { SupabaseService } from './supabase.service';
import { IUser } from '../lib/interfaces';

/**
 * Servicio para gestionar los usuarios en la aplicación.
 * Se conecta con Supabase para obtener, registrar y eliminar usuarios.
 * Utiliza un BehaviorSubject para emitir cambios en la lista de usuarios.
 */
@Injectable({
    providedIn: 'root'
})

export class UserService {

    /** Subject que contiene la lista de usuarios actual */
    private users = new BehaviorSubject<IUser[]>([]);

    /** Observable que expone la lista de usuarios */
    users$ = this.users.asObservable();

    /** Marca si el servicio ya fue inicializado */
    private initialized = false;

    constructor(private supabaseService: SupabaseService) {
        this.initialize();
    }

    /**
    * Inicializa el servicio validando la tabla 'users' en Supabase.
    * Luego carga los usuarios a la lista.
    */
    async initialize() : Promise<void> {
        if (this.initialized) return;

        try {
            const { error } = await this.supabaseService.client
                .from('users')
                .select('count')
                .limit(0); // Validación de existencia de la tabla
            if (error) throw error;

            await this.getUsers(); // Carga inicial de usuarios
            this.initialized = true;
        } catch (error) {
            this.users.error(error); // Propaga el error en el observable
        }
    }

    /**
     * Consulta todos los usuarios de la tabla 'users' y los guarda en el Subject.
     */
    private async getUsers(): Promise<void> {
        try {
            const { data, error } = await this.supabaseService.client
                .from('users')
                .select('*');
            if (error) throw error;

            this.users.next(data || []); // Actualiza la lista observable
        } catch (error) {
            this.users.error(error);
        }
    }

    /**
     * Registra un nuevo usuario en Supabase Auth y en la tabla 'users'.
     * @param user Usuario a registrar (sin ID ni created_at)
     * @throws Error si el email o username ya están registrados o si ocurre algún error en Auth o DB
     */
    async register(user: Omit<IUser, 'id' | 'created_at'>): Promise<void> {
        const supabase = this.supabaseService.client;

        // Verifica que no exista el username
        const { data: existingUsername } = await supabase
            .from('users')
            .select('id')
            .eq('username', user.username)
            .single();
        if (existingUsername) throw new Error('Usuario ya registrado.');

        // Verifica que no exista el email
        const { data: existingEmail } = await supabase
            .from('users')
            .select('id')
            .eq('email', user.email)
            .single();
        if (existingEmail) throw new Error('Email ya registrado.');

        // Registro en Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: user.email,
            password: user.password,
        });
        if (authError || !authData?.user)
            throw new Error(authError?.message || 'Error al registrar en Auth');

        // Registro en la tabla 'users'
        const { error: insertError } = await supabase
            .from('users')
            .insert([{ 
                username: user.username, 
                email: user.email, 
                phone: user.phone 
            }]);
        if (insertError) throw new Error(insertError.message);

        await this.getUsers(); // Actualiza la lista de usuarios tras la inserción
    }

    /**
     * Elimina un usuario de la tabla 'users' y cierra sesión en Supabase Auth.
     * @param userId ID del usuario a eliminar
     */
    async deleteUserAccount(userId: string): Promise<void> {
        const supabase = this.supabaseService.client;

        // Elimina el usuario de la tabla
        const { error: deleteError } = await supabase
            .from('users')
            .delete()
            .eq('id', userId);
        if (deleteError) throw deleteError;

        // Cierra sesión y limpia tokens almacenados
        await supabase.auth.signOut();
        localStorage.removeItem('supabase.auth.token');
        sessionStorage.removeItem('supabase.auth.token');
    }
}
