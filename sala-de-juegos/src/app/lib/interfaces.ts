
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
    user_name: string;
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


export interface ITriviaPreguntas{
    id: number;
    pregunta: string;
    categoria: { nombre: string };
    opciones: string[];
    respuestaCorrecta: string;
}

export interface IQuestion {
    id: number;
    pregunta: string;
    categoria: string;
    opciones: string[];
    respuestaCorrecta: string;
}

export interface ITriviaState {
    currentQuestion: IQuestion | null;
    selectedAnswer: string | null;
    feedBack: string | null;
    isCorrect: boolean;
    puntaje: number;
    questionsAnswered: number;
    correctAnswers: number;
    gameOver: boolean;
}

export interface IGameResult {
    id?: string; //con signo de pregunta
    user_id: string;
    game_type: string;
    puntaje: number;
    won: boolean;
    details?: any; // signo
    fecha?: Date; // signo 
}

export interface IUserInfo {
    id: string;
    email: string;
    username: string;
    phone?: string | null;
}

export interface IPartidaAhorcado {
    user_id: string | null;
    palabra: string;
    letras_usadas: string[];
    intentos: number;
    resultado: 'ganó' | 'perdió';
    fecha: string;
}