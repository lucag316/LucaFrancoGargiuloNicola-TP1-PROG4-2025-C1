import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js'; // Importa los tipos y funciones necesarias de Supabase
import { BehaviorSubject } from 'rxjs'; // Importar BehaviorSubject para manejo de usuarios en tiempo real
import { SUPABASE_CONFIG } from '../lib/constants'; // Constantes de configuración de Supabase
import { IDatabase, IUser } from '../lib/interfaces';  // Interface para definir el tipo de usuario
import { isPlatformBrowser } from '@angular/common'; // Detecta si estamos en el navegador

import { environment } from '../enviroments/enviroment'; // Importa las variables de entorno (URL y clave del proyecto de Supabase)


@Injectable({
    providedIn: 'root' // Hace que este servicio esté disponible a nivel global en la app
})


export class SupabaseService {

    private supabase!: SupabaseClient;  // Cliente de Supabase para interactuar con el backend
    private users = new BehaviorSubject<IUser[]>([]); // BehaviorSubject para almacenar y emitir usuarios
    users$ = this.users.asObservable(); // Observable para escuchar cambios en la lista de usuarios

    private initialized = false; // Indica si el servicio ha sido inicializado correctamente


    /**
    * Constructor de SupabaseService
    * Inicializa el cliente de Supabase solo si estamos en el navegador
    */
    constructor( @Inject(PLATFORM_ID) private platformId: Object ) {
        if(isPlatformBrowser(this.platformId)){
            try{
                // Crea el cliente de Supabase usando las configuraciones definidas
                this.supabase = createClient(
                    SUPABASE_CONFIG.url, 
                    SUPABASE_CONFIG.key, 
                    SUPABASE_CONFIG.options);
                this.initialize(); // Inicializa el servicio
            } catch (error) {
                this.users.error(error); // Manejo de errores si no se puede crear el cliente
            }
        }
    }

    /**
   * Método de inicialización del servicio
   * Solo se ejecuta una vez, y obtiene el número de usuarios en la tabla
   */
    private async initialize() {
        if (this.initialized) {
            return; // Si ya está inicializado, no hace nada
        } 

        try {
            const { data, error } = await this.supabase.from('users').select('count').limit(0);
            if (error) {
                throw error; // Si hay error en la consulta, lo lanza
            }
            await this.getUsers(); // Obtiene los usuarios desde la base de datos
            this.initialized = true; // Marca el servicio como inicializado
        } catch (error) {
            this.users.error(error); // Si ocurre un error en la inicialización, lo maneja
        }
    }

    /**
   * Método privado para obtener los usuarios desde la base de datos
   */
    private async getUsers() {
        try{
            const response = await this.supabase.from('users').select('*');
            if (response.error) {
                throw response.error; // Si hay error en la consulta, lo lanza
            }
            const users = response.data || []; // Guarda los usuarios obtenidos
            this.users.next(users); // Actualiza el valor de los usuarios
        } catch (error) {
            this.users.error(error); // Si ocurre un error, lo maneja
        }
    }

    /**
   * Método para registrar un nuevo usuario
   * @param user Objeto que contiene los datos del usuario a registrar
   */
    async register(user: Omit<IUser, 'id' | 'created_at'>): Promise<void> {
        try {
            // Realiza el registro en la autenticación de Supabase
            const { data: authData, error: authError } = await this.supabase.auth.signUp({
                email: user.email,
                password: user.password,
            });
        
            // Si hubo un error en la autenticación o no se creó el usuario, lanza un error
            if (authError || !authData?.user) {
                throw new Error(authError?.message || 'No se pudo registrar el usuario en Auth');
            }
        
            // Inserta los datos del usuario en la tabla 'users' de Supabase
            const { error: insertError } = await this.supabase
                .from('users')
                .insert([{
                    username: user.username,
                    email: user.email,
                    phone: user.phone,
            }]);
        
            // Si hubo un error insertando los datos, lanza un error
            if (insertError) {
                console.error('Error insertando en tabla users:', insertError);
                throw new Error(insertError.message);
            }
        
            await this.getUsers();
        } catch (error) {
            console.error('Error completo del register():', error); // Log del error completo
            throw error; // Relanza el error para que lo pueda manejar el componente
        }
    }



    /**
    * Busca el email asociado al nombre de usuario
    */
    async getEmailByUsername(username: string): Promise<string | null> {
        const { data, error } = await this.supabase
            .from('users') // tu tabla personalizada de usuarios
            .select('email')
            .eq('username', username)
            .single();

        if (error || !data) {
            return null;
        }

        return data.email;
    }

    async loginWithUsername(username: string, password: string) {
        // Paso 1: buscar el email por el username
        const { data: userData, error: fetchError } = await this.supabase
            .from('users')
            .select('email')
            .eq('username', username)
            .single();
        if (fetchError || !userData?.email) {
            return { error: { message: 'Usuario no encontrado' } };
        }
    
        // Paso 2: hacer login con el email obtenido
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email: userData.email,
            password,
        });
        return { data, error };
    }

    async login(email: string, password: string) {
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email,
            password
        });
    
        return { data, error };
    }

    /**
    * Verifica si hay una sesión activa (async)
    */
    async isLoggedIn(): Promise<boolean> {
        const { data } = await this.supabase.auth.getSession();
        return !!data.session;
    }

}







    /*
    private async loadUsers() {
      try {
        const { data, error } = await this.supabase.from('users').select('*');
        if (error) {
          throw error;
        }
        this.users.next(data);
      } catch (error) {
        this.users.error(error);
      }
    }*/

    

    /*
    // Método para login
    async signInWithUsername(username: string, password: string) {
        const email = `${username}@tudominio.com`; // Asegúrate que coincida con lo registrado
        const { data, error } = await this.supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) {
          throw new Error(this.getUserFriendlyError(error.message));
        }
        return data;
      }
      
      private getUserFriendlyError(error: string): string {
        if (error.includes('Invalid login credentials')) {
          return 'Credenciales inválidas';
        }
        return 'Error al iniciar sesión';
      }
    */
    
    




















/*

import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js'; // Importa los tipos y funciones necesarias de Supabase

import { environment } from '../enviroments/enviroment'; // Importa las variables de entorno (URL y clave del proyecto de Supabase)


export interface IUser {
    username: string;
    password: string;
    email: string;
    phone: string;
}

@Injectable({
    providedIn: 'root' // Hace que este servicio esté disponible a nivel global en la app
})


export class SupabaseService {

    private supabase: SupabaseClient; // Cliente de Supabase para conectarse al backend
    // private _session: AuthSession | null = null; // Almacena la sesión de autenticación actual (si existe)

    constructor() {
        this.supabase = createClient(
            environment.supabaseUrl,
            environment.supabaseKey
        ); // Crea el cliente de Supabase usando las variables de entorno

    }

    // Método para login
    async signInWithUsername(username: string, password: string) {
        const email = `${username}@tudominio.com`; // Asegúrate que coincida con lo registrado
        const { data, error } = await this.supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) {
          throw new Error(this.getUserFriendlyError(error.message));
        }
        return data;
      }
      
      private getUserFriendlyError(error: string): string {
        if (error.includes('Invalid login credentials')) {
          return 'Credenciales inválidas';
        }
        return 'Error al iniciar sesión';
      }

    // Método para registro
    async register(email: string, password: string) {
        const { data, error } = await this.supabase.auth.signUp({
            email,
            password
        });
        if (error) throw error;
        return data;
    }
}
*/