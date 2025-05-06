

import { SupabaseClientOptions } from "@supabase/supabase-js";


export const SUPABASE_CONFIG ={
    url: 'https://kobiijyzrxtfqziopdxr.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvYmlpanl6cnh0ZnF6aW9wZHhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0OTMyODAsImV4cCI6MjA2MjA2OTI4MH0.6ct2CluJS_E5QlqmnYwsvfQY4oJ4DBNqzUDJ3GukY-E',
    options: {
        db:{
            schema: 'public'
        },
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        },
        global: {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    } as SupabaseClientOptions<'public'>
};