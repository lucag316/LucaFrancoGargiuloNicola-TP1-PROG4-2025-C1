
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
    palo: 'corazones' | 'diamantes' | 'tréboles' | 'picas';
    valor: number; // 1 al 13 (A=1, J=11, Q=12, K=13)
    imagen: string; // ruta de la imagen
}
