
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js'; // Importa los tipos y funciones necesarias de Supabase
import { SUPABASE_CONFIG } from '../lib/constants'; // Constantes de configuración de Supabase
import { isPlatformBrowser } from '@angular/common'; // Detecta si estamos en el navegador



@Injectable({
    providedIn: 'root' // Hace que este servicio esté disponible a nivel global en la app
})



export class SupabaseService {

    private supabase!: SupabaseClient;

    constructor(@Inject(PLATFORM_ID) platformId: Object) {
        if (isPlatformBrowser(platformId)) {
            this.supabase = createClient(
                SUPABASE_CONFIG.url,
                SUPABASE_CONFIG.key,
                SUPABASE_CONFIG.options
            );
        }
    }

    get client(): SupabaseClient {
        return this.supabase;
    }

    
}



