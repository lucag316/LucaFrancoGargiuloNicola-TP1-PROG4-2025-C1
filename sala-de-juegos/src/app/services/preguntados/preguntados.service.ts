

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ITriviaPreguntas } from '../../lib/interfaces';

@Injectable({
    providedIn: 'root'
})



export class PreguntadosService {

    private apiUrl = ''; // Futuro endpoint de API externa
    private preguntasJsonPath = '../../../assets/data/trivia-questions.json';

    private cachedPreguntas: ITriviaPreguntas[] = [];
    private usedQuestionIds: Set<number> = new Set<number>();

    constructor(private http: HttpClient) {
        // precargar las preguntas json
        this.loadQuestionsFromJson().subscribe(questions => {
            this.cachedPreguntas = questions;
            console.log(`✅ Se cargaron ${this.cachedPreguntas.length} preguntas del archivo JSON`); 
        });
    }

    /**
    * Carga una pregunta aleatoria desde la API externa (si está disponible).
    * Si falla, devuelve una pregunta del archivo JSON.
    */
    getRandomQuestion(): Observable<ITriviaPreguntas>{
        
        return this.http.get<ITriviaPreguntas>(this.apiUrl).pipe(
            catchError(error => {
                console.error('⚠️ Error al obtener preguntas desde la API, usando fallback:', error);
                return of(this.getFallBackQuestion());
            })
        )
    }

    /**
   * Carga todas las preguntas del archivo JSON.
   */
    loadQuestionsFromJson(): Observable<ITriviaPreguntas[]> {
        return this.http.get<ITriviaPreguntas[]>(this.preguntasJsonPath).pipe(
            catchError(error => {
                console.error('❌ Error al cargar preguntas del archivo JSON:', error);
                return of([]);
            })
    
        );
    }
    

    /**
   * Devuelve una pregunta aleatoria del JSON local evitando repeticiones.
   */
    private getFallBackQuestion(): ITriviaPreguntas {
        if (this.cachedPreguntas.length === 0) {
            return this.getDefaultQuestion();
        }

        // Reset si ya usamos todas
        if(this.usedQuestionIds.size >= this.cachedPreguntas.length){
            this.usedQuestionIds.clear();
        }

        // Filtrar preguntas no usadas
        let availableQuestions = this.cachedPreguntas.filter(question => !this.usedQuestionIds.has(question.id));

        if (availableQuestions.length === 0) {
            availableQuestions = this.cachedPreguntas;
        }

        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        const selectedQuestion = availableQuestions[randomIndex];
        this.usedQuestionIds.add(selectedQuestion.id);

        return selectedQuestion;
    }


    /**
   * Pregunta por defecto en caso de que no haya JSON o falle todo.
   */
    private getDefaultQuestion(): ITriviaPreguntas {
        const defaultQuestion: ITriviaPreguntas[] = [
            {
                id: 1,
                pregunta: '¿Cuál es la capital de España?',
                categoria: {nombre: 'Geografía'},
                opciones: ['Madrid', 'Barcelona', 'Sevilla', 'Valencia'],
                respuestaCorrecta: 'Madrid'
            },
            {
                id: 2,
                pregunta: '¿Qué planeta es el más cercano al Sol?',
                categoria: { nombre: 'Ciencia' },
                opciones: ['Venus', 'Marte', 'Mercurio', 'Júpiter'],
                respuestaCorrecta: 'Mercurio'
            },
            {
                id: 3,
                pregunta: '¿Quién escribió “Cien años de soledad”?',
                categoria: { nombre: 'Literatura' },
                opciones: ['Pablo Neruda', 'Gabriel García Márquez', 'Mario Vargas Llosa', 'Isabel Allende'],
                respuestaCorrecta: 'Gabriel García Márquez'
            },
        ];
        //HACER 10 ASI
    
        const randomIndex = Math.floor(Math.random() * defaultQuestion.length);
        return defaultQuestion[randomIndex];
    }




}
