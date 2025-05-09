
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
    id: UUID;
    username: string;
    message: string;
    timestamp?: string;
}