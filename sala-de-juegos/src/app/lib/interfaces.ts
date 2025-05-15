
export type UUID = string;

export interface IUser {
    id: UUID;
    created_at?: string;
    username: string;
    password: string;
    email: string;
    phone: string;
}

export interface IDatabase {
    public: {
        tables: {
            users: {
                Row: IUser;
                insert: Omit<IUser, 'id' | 'created_at'>;
                update: Partial<Omit<IUser, 'id' | 'created_at'>>;
            };
        };
    };
}

export interface IMessage {
    id: number;         
    message: string;    
    timestamp: string;  
    user_id: string;
    user_email: string;
}

export interface ICarta{
    palo: 'hearts' | 'diamonds' | 'clubs' | 'spades';
    valor: number; // 1 al 13 (A=1, J=11, Q=12, K=13)
    imagen: string; // ruta de la imagen
}

export interface IPartidaSimon {
    puntaje: number;
    fecha: string;           // Fecha de guardado (fin de partida)
    secuencia: string[];     // Array de colores que formó la secuencia
    fechaInicio: string;     // Fecha/hora en que empezó la partida
    duracion: number;        // Duración en segundos
}