

import { Component, OnInit } from '@angular/core';
import { NgClass, NgIf, NgFor } from '@angular/common';
import { firstValueFrom } from 'rxjs';

import { PreguntadosService } from '../../../../services/preguntados/preguntados.service';
import { GamesService } from '../../../../services/games/games.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { RefreshService } from '../../../../services/refresh/refresh.service';
import { SupabaseService } from '../../../../services/supabase/supabase.service';

import { ITriviaPreguntas, IQuestion, ITriviaState } from '../../../../lib/interfaces';
// top ten component


@Component({
    selector: 'app-preguntados',
    standalone: true,
    imports: [NgClass, NgIf, NgFor],
    templateUrl: './preguntados.component.html',
    styleUrl: './preguntados.component.css'
})


export class PreguntadosComponent implements OnInit {

    
    state: ITriviaState = this.getInitialState(); // Estado del juego
    maxQuestions: number = 10; // Cantidad máxima de preguntas por partida
    loading: boolean = false; // Indicador de carga de pregunta
    private resultsSaved: boolean = false; // Bandera para evitar múltiples guardados


    constructor(
        private preguntadosService: PreguntadosService, 
        private authService: AuthService,
        private gameService: GamesService,
        private refreshService: RefreshService,
        private supabaseService: SupabaseService
    ) {}

    /**
    * Inicializa el juego al cargar el componente
    */
    ngOnInit(): void {
        this.startNewGame();
    }

    /**
    * Devuelve el estado inicial del juego
    */
    private getInitialState(): ITriviaState {
        return {
            currentQuestion: null,
            selectedAnswer: null,
            feedBack: null,
            isCorrect: false,
            score: 0,
            questionsAnswered: 0,
            correctAnswers: 0,
            gameOver: false
        };
    }

    /**
    * Inicia una nueva partida
    */
    startNewGame(){
        this.state = this.getInitialState();
        this.refreshService.refreshComponent('preguntados')
        this.loadNextQuestion();
    }

    /**
    * Carga la siguiente pregunta del juego
    */
    loadNextQuestion(): void {
        
        if (this.state.questionsAnswered >= this.maxQuestions) {
            this.endGame();
            return;
        }

        this.state.feedBack = null;
        this.state.selectedAnswer = null;
        this.loading = true;

        this.preguntadosService.getRandomQuestion().subscribe({
            next: (question: any) => {
                try {
                    this.state.currentQuestion = {
                        id: question.id,
                        pregunta: question.pregunta,
                        categoria: typeof question.categoria === 'object' ? question.categoria.nombre : question.categoria,
                        opciones: Array.isArray(question.opciones) ? question.opciones.slice(0, 4) : 
                        ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4'],
                        respuestaCorrecta: question.respuestaCorrecta
                    };

                    console.log('Pregunta cargada:', this.state.currentQuestion);
                } catch (error) {
                    console.error('Error al procesar la pregunta:', error);
                    this.useBackupQuestion();
                }

                this.loading = false;
            },
            error: (error) => {
                console.error('Error al obtener la pregunta:', error);
                this.useBackupQuestion();
                this.loading = false;
            }
        });
    }

    /**
    * Usa una pregunta de respaldo en caso de error
    */
    useBackupQuestion(){
        const backupQuestions = [
            {
                id: 1,
                pregunta: '¿Cuál es la capital de España?',
                categoria: 'Geografía',
                opciones: ['Madrid', 'Barcelona', 'Sevilla', 'Valencia'],
                respuestaCorrecta: 'Madrid'
            },
            {
                id: 2,
                pregunta: '¿Cuál es el animal más grande del mundo?',
                categoria: 'Animales',
                opciones: ['Elefante', 'Tigre', 'Jirafa', 'Gato'],
                respuestaCorrecta: 'Elefante'
            }
        ]

        const randomIndex = Math.floor(Math.random() * backupQuestions.length);
        this.state.currentQuestion = backupQuestions[randomIndex];
    }

    /**
   * Maneja la selección de una respuesta por parte del usuario
   * @param option Respuesta seleccionada
   */
    selectAnswer(option: string): void {
        if (this.state.selectedAnswer || !this.state.currentQuestion) return;

        this.state.selectedAnswer = option;
        this.state.isCorrect = option === this.state.currentQuestion.respuestaCorrecta;
        this.state.feedBack = this.state.isCorrect
            ? 'Respuesta correcta'
            : `Respuesta incorrecta. La respuesta correcta es: ${this.state.currentQuestion.respuestaCorrecta}`;


        this.state.questionsAnswered++;

        if(this.state.isCorrect){
            this.state.correctAnswers++;
            this.state.score += 10;
        }

        if ( this.state.questionsAnswered >= this.maxQuestions) {
            if (!this.state.gameOver) {
                setTimeout(() => this.endGame(), 1500);
            }
        }

    }

    /**
    * Finaliza el juego y guarda el resultado
    */
    async endGame(): Promise<void> {
        if(this.state.gameOver) return;

        this.state.gameOver = true;
        this.state.feedBack = `Juego terminado. Tu puntuacion es ${this.state.score}. Respuestas correctas ${this.state.correctAnswers}/${this.maxQuestions}`
    
        //await this.saveGameResult();
        await this.guardarPartida()
    
    }

    /**
    * Guarda el resultado del juego en Supabase
    */
    async saveGameResult(): Promise<void>{
        if (this.resultsSaved) return;

        try{
            const user = await this.authService.getUserInfo();
            if (user) {
                await this.gameService.saveGameResult({
                    user_id: user.id,
                    game_type: 'preguntados',
                    score: this.state.score,
                    won: this.state.correctAnswers > (this.maxQuestions / 2), // si acerto mas de la mitad
                    details: {
                        questionsAnswered: this.state.questionsAnswered,
                        correctAnswers: this.state.correctAnswers,
                        maxQuestions: this.maxQuestions
                    }
                });

                this.resultsSaved = true;
                console.log("Resultado del juego guardado con éxito");
            }
        }catch (error) {
            console.error("Error al guardar el resultado del juego:", error);
        }
    }

    /**
 * Guarda el resultado del juego en la tabla específica de Preguntados
 */
    async guardarPartida() {
        if (this.resultsSaved) return; // Evitar guardar más de una vez

        try {
            const user = await this.authService.getUserInfo();

            const partida = {
                user_id: user?.id,
                score: this.state.score,
                won: this.state.correctAnswers > (this.maxQuestions / 2),
                details: {
                    questionsAnswered: this.state.questionsAnswered,
                    correctAnswers: this.state.correctAnswers,
                    maxQuestions: this.maxQuestions
                },
                created_at: new Date()
            };

            await this.preguntadosService.guardarPartida(partida);

            this.resultsSaved = true;
            console.log("✅ Resultado del juego Preguntados guardado con éxito");
        } catch (error) {
            console.error("❌ Error al guardar el resultado del juego Preguntados:", error);
        }
    }

}


