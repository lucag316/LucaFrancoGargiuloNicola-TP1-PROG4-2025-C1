
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js'; // Importa los tipos y funciones necesarias de Supabase
import { BehaviorSubject } from 'rxjs'; // Importar BehaviorSubject para manejo de usuarios en tiempo real
import { SUPABASE_CONFIG } from '../lib/constants'; // Constantes de configuración de Supabase
import { isPlatformBrowser } from '@angular/common'; // Detecta si estamos en el navegador
import { IDatabase, IUser, IMessage } from '../lib/interfaces';  // Interface para definir el tipo de usuario



@Injectable({
    providedIn: 'root' // Hace que este servicio esté disponible a nivel global en la app
})



export class SupabaseService {

    private supabase!: SupabaseClient;  // Cliente de Supabase para interactuar con el backend
    private initialized = false; // Indica si el servicio ha sido inicializado correctamente
    
    private users = new BehaviorSubject<IUser[]>([]); // BehaviorSubject para almacenar y emitir usuarios
    users$ = this.users.asObservable(); // Observable para escuchar cambios en la lista de usuarios

    authStatus$ = new BehaviorSubject<boolean>(false);


    private messagesSubject = new BehaviorSubject<IMessage[]>([]);
    public messages$ = this.messagesSubject.asObservable();

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
                // Inicializa y luego verifica el estado de autenticación
                this.initialize().then(() => {
                    this.checkAuthStatus();
                });
                
            } catch (error) {
                this.users.error(error); // Manejo de errores si no se puede crear el cliente
                console.error('Error inicializando Supabase:', error);
            }
        }
    }

    /**
   * Método de inicialización del servicio
   * Solo se ejecuta una vez, y obtiene el número de usuarios en la tabla
   */
    async initialize() {
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

            // Verificar si ya existe un usuario con el mismo username
            const { data: existingUsername, error: usernameError } = await this.supabase
                .from('users')
                .select('id')
                .eq('username', user.username)
                .single();

            if (existingUsername) {
                throw new Error('El nombre de usuario ya está registrado.');
            }

            // Verificar si ya existe un usuario con el mismo email
            const { data: existingEmail, error: emailError } = await this.supabase
                .from('users')
                .select('id')
                .eq('email', user.email)
                .single();

            if (existingEmail) {
                throw new Error('El correo electrónico ya está registrado.');
            }

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
                console.error('Error insertando en tabla users:', insertError); // despues sacarlo 
                throw new Error(insertError.message);
            }
        
            await this.getUsers(); // Actualiza la lista de usuarios

        } catch (error) {
            console.error('Error completo del register():', error); // Log del error completo
            throw error; // Relanza el error para que lo pueda manejar el componente
        }
    }



    /**
   * Inicia sesión con usuario y contraseña (usa email obtenido desde username).
   */
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

        // Asegurate de actualizar el estado de autenticación
        if (data?.session) {
            this.authStatus$.next(true);
        }
        return { data, error };
    }


    /**
    * Cierra la sesión actual del usuario.
    */
    async logout(): Promise<void> {
        await this.supabase.auth.signOut();
        this.authStatus$.next(false);
    }

    /**
     * Obtiene información del usuario actualmente autenticado.
     */
    async getUser() {
        return await this.supabase.auth.getUser();
    }

    /**
     * Verifica si el usuario está autenticado y actualiza `authStatus$`.
     */
    async checkAuthStatus() {
        try {
            const { data, error } = await this.supabase.auth.getSession();
            const isLoggedIn = !!data?.session?.user;
            this.authStatus$.next(isLoggedIn);
        } catch (e) {
            console.error('Error verificando la sesión:', e);
            this.authStatus$.next(false);
        }
    }
    

    /**
     * Devuelve `true` si hay una sesión activa.
     */
    async isLoggedIn(): Promise<boolean> {
        const { data } = await this.supabase.auth.getSession();
        return !!data.session;
    }


    /** Cargar mensajes existentes desde la base de datos */
    async loadInitialMessages(): Promise<void> {
        const { data, error } = await this.supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: true });

        if (error) {
            console.error('Error al cargar mensajes iniciales:', error);
            return;
        }

        this.messagesSubject.next(data as IMessage[]);
    }

    /**
   * Envía un nuevo mensaje a la base de datos.
   * @param username Nombre de usuario del remitente.
   * @param message Contenido del mensaje.
   */
    async sendMessage(username: string, message: string): Promise<void> {
        const { error } = await this.supabase
            .from('messages')
            .insert([{ username, message }]);

        if (error) {
            console.error('Error al enviar mensaje:', error);
            throw error;
        }
    }


   /** Escucha nuevos mensajes en tiempo real */
    listenForMessages(): void {
        this.supabase
        .channel('public:messages')
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'messages' },
            (payload) => {
                const currentMessages = this.messagesSubject.getValue();
                this.messagesSubject.next([...currentMessages, payload.new as IMessage]);
            }
        )
        .subscribe();
    }


}



