
# Sala de Juegos 🎮

Aplicación interactiva desarrollada en Angular que permite a los usuarios ejercitar sus habilidades cognitivas y motrices a través de diversos juegos clásicos y uno original. Incluye autenticación, estadísticas personalizadas por jugador y juego, chat en tiempo real y una experiencia de usuario fluida y moderna.

---

## 📋 Indice
- [👨‍💻 Información del Proyecto](#-información-del-proyecto)
- [🔗 Links importantes](#-links-importantes)
- [🎯 Objetivo General](#-objetivo-general)
- [🛠️ Tecnologías utilizadas](#️-tecnologías-utilizadas)
- [🌟 Caracteristicas principales](#-caracteristicas-principales)
- [🧠 Juego Propio: "Simón Dice - Secuencia de Colores"](#-juego-propio-simón-dice---secuencia-de-colores)
- [🧑‍💼 Funcionalidades por Sprint](#-funcionalidades-por-sprint)
  - [🟢 Sprint 1 (28/04)](#-sprint-1-2804)
  - [🟡 Sprint 2 (05/05)](#-sprint-2-0505)
  - [🔵 Sprint 3 (12/05)](#-sprint-3-1205)
  - [🔴 Sprint 4 (19/05)](#-sprint-4-1905)
  - [⚫ Sprint 5 (Recuperatorio - Opcional)](#-sprint-5-recuperatorio---opcional)

---

## 👨‍💻 Información del Proyecto

- **Nombres**: Luca Franco
- **Apellidos**: Gargiulo Nicola
- **Materia**: Programación IV
- **Nivel**: 4° Cuatrimestre
- **Comisión**: 2025 C1
- **Docente:** Rodrigo Plazas  
- **Tipo de Examen**: Primer Parcial

---

## 🔗 Links importantes

-🔗 **Repositorio GitHub**: *[https://github.com/lucag316/LucaFrancoGargiuloNicola-TP1-PROG4-2025-C1.git]*

-🔗 **Deploy en Vercel**: *[https://probando2.vercel.app/home]*

-🔗 **Deploy en Vercel**: *[https://luca-juegos.vercel.app/home]*

---

## 🎯 Objetivo General

Desarrollar una plataforma web que permita a usuarios registrados acceder a una sala de juegos con diversas propuestas lúdicas, visualizar sus estadísticas y comunicarse mediante un sistema de chat en tiempo real. El proyecto se desarrolla en 4 sprints con entregas incrementales.

---

## 🛠️ Tecnologías utilizadas

### Frontend

- Angular 19
- TypeScript
- HTML

### UI / UX

- Bootstrap
- CSS / TypeScript para animaciones

### Backend / Servicios

- Supabase (autenticación y base de datos en tiempo real)

### Herramientas de Desarrollo

- Git y GitHub
- Visual Studio Code
- Vercel (deploy)

---

## 🌟 Caracteristicas principales

### 🛡️ Sistema de Autenticación

- Registro con validación de formularios
- Login con Supabase/Firebase
- Acceso rápido para testing

### 🎲 Juegos Implementados

1. 🪓 Ahorcado - Clásico juego de adivinanza de palabras
2. 🔢 Mayor o Menor - Juego de predicción con cartas
3. ❓  Preguntados - Trivia con API externa
4. 🧠 Simón Dice (juego propio) - Memoria secuencial de colores


### 💬 Comunicación

- Sala de chat en tiempo real
- Diferenciación de mensajes propios/ajenos
- Notificaciones visuales

---

## 🧠 Juego Propio: "Simón Dice - Secuencia de Colores"

El juego presenta al usuario una secuencia de colores que debe memorizar y repetir. Cada acierto alarga la secuencia con un color adicional. Al cometer un error, el juego se reinicia desde el principio. El objetivo es lograr la secuencia más larga posible.


---

## 🧑‍💼 Funcionalidades por Sprint

### 🟢 Sprint 1 (28/04)

- Creación del proyecto y deploy inicial.
- Componentes base: `Login`, `Registro`, `Home`, `Quién Soy`.
- Navegación funcional entre componentes.
- API GitHub: mostrar datos del alumno en “Quién Soy”.
- Favicon personalizado.
- Descripción detallada del juego propio.

En este primer sprint se sentaron las bases fundamentales de la aplicación. Se trabajó principalmente en la estructura general, el diseño de componentes iniciales, la navegación entre pantallas y la integración con la API de GitHub.

#### Tareas realizadas:

- **Creación del proyecto Angular:**

  Se utilizó Angular CLI para generar el proyecto y se realizó la configuración inicial necesaria para el entorno de desarrollo. También se subió el proyecto a GitHub y se configuró el deploy automático en Vercel para pruebas y presentación.

- **Implementación de componentes principales:**

  - `LoginComponent`: formulario básico para inicio de sesión.
  - `RegisterComponent`: formulario de registro con estructura lista para validaciones.
  - `HomeComponent`: pantalla de bienvenida que actúa como hub principal de navegación.
  - `QuienSoyComponent`: sección informativa con datos personales y descripción del juego propio.

- **Navegación entre componentes:**

  Se definieron las rutas correspondientes a cada componente en el archivo de rutas (`app.routes.ts`), y se estableció la navegación utilizando botones y enlaces en los templates HTML. Esto permite al usuario moverse fluidamente por las secciones de la aplicación.


- **Integración con API de GitHub:** 

  Se consumió la API pública de GitHub (`https://api.github.com/users/lucag316`) para mostrar dinámicamente los datos del usuario (nombre, avatar, bio, ubicación, repositorios, seguidores, etc.) en el componente `QuienSoyComponent`. Se usó `HttpClient` junto con una `signal` reactiva para manejar los datos, y se renderizaron de forma condicional en el template. Esta integración demuestra el consumo de APIs REST externas con Angular moderno.

- **Descripción del juego propio “Simón Dice”:**

  En la sección `Quién Soy` se agregó una explicación clara del funcionamiento del juego propio. Se detalló la lógica: mostrar una secuencia creciente de colores que el jugador debe repetir correctamente. Si se equivoca, el juego se reinicia.

- **Favicon personalizado:**

  Se reemplazó el favicon por defecto de Angular por un ícono representativo del proyecto, visible tanto localmente como en el deploy online.

### 🟡 Sprint 2 (05/05)

- Componente Home centralizado según estado de sesión.
- Login funcional usando Supabase. Botones de acceso rápido.
- Registro validado y navegación automática post-registro.

En este sprint se avanzó en la funcionalidad de autenticación usando Supabase, mejorando la experiencia de usuario con validaciones, botones para acceso rápido y gestión del estado de sesión para mostrar opciones dinámicas en la pantalla principal.

#### Tareas realizadas:

- **HomeComponent adaptativo:**

  Se modificó el componente Home para mostrar botones o información diferente según si el usuario está autenticado o no, centralizando la experiencia principal de la aplicación.

- **Login funcional con Supabase:**

  Se integró el servicio de autenticación de Supabase para validar usuarios. El login ahora es real y funcional, con manejo de errores y feedback visual.

- **Botón de acceso rápido:**

  Se añadió un botón preconfigurado para que el usuario pueda ingresar rápidamente con cuenta de prueba, mejorando la usabilidad.

- **Registro validado:**

  El formulario de registro cuenta con validaciones en tiempo real, asegurando que los datos ingresados sean correctos antes de enviar la solicitud.


- **Navegación automática post-registro:**

  Una vez que el usuario se registra correctamente, se redirige automáticamente a la página Home, mejorando el flujo de usuario. (igualmente hay que confirmar mail)



### 🔵 Sprint 3 (12/05)

- Implementación de juegos: Ahorcado y Mayor o Menor.
- Guardado de información de partidas.
- Chat en tiempo real: mensajes diferenciados según usuario.

Este sprint estuvo enfocado en el desarrollo de las funcionalidades más interactivas de la aplicación: los juegos (ahorcado y mayor o menor) y la sala de chat. Se trabajó en la lógica de los juegos, su interfaz visual, persistencia de partidas en la base de datos y comunicación en tiempo real entre usuarios.

#### Tareas realizadas:

##### 🎮 Juego Ahorcado:


- **Componente AhorcadoComponent:**

- Standalone y funcional.
- Muestra la palabra oculta y los espacios disponibles.
- Incluye botones con todas las letras del abecedario.
- Detecta letras usadas, cantidad de intentos fallidos y aciertos.

- **Lógica de juego:**

- La palabra se selecciona aleatoriamente.
- Cada intento se registra y actualiza la UI.
- Finaliza cuando el jugador adivina la palabra o se queda sin intentos.

- **Guardado de partidas:**

- Se utiliza AhorcadoService para registrar la partida en Supabase (partidas_ahorcado).
- Se guarda: id de partida, id de usuario (FK), palabra, letras usadas, intentos, resultado, fecha y puntaje calculado


##### 🃏 Juego Mayor o Menor:


- **Componente MayorOMenorComponent:**

- Standalone y funcional.
- Muestra una carta visible al jugador, una carta dada vuelta y dos botones: Mayor, Menor.

- **Mecánica de juego:**

- El jugador intenta adivinar si la próxima carta será mayor o menor a la actual.
- Si acierta, suma puntos y continúa con la siguiente carta.
- Si falla o se acaban las cartas, el juego termina.

- **Persistencia en Supabase:**

- Se utiliza MayorOMenorService para guardar la partida en la tabla partidas_mayor_o_menor.
- Se guarda: id de partida, id de usuario (FK), puntaje calculado y fecha.

##### 💬 Chat en Tiempo Real:

- **Componente ChatComponent:**

- Permite enviar y visualizar mensajes en tiempo real.
- Usa Supabase con canales (realtime) para suscribirse a nuevos mensajes.

- **Lógica y funcionalidades:**

- Los mensajes se almacenan en la tabla messages de Supabase.
- Se diferencian visualmente los mensajes del propio usuario y los de otros.
- Scroll automático para mantenerse en el mensaje más reciente.
- Manejo de estados de carga, errores y validación de mensajes vacíos.
- Compatible con múltiples usuarios conectados simultáneamente.


### 🔴 Sprint 4 (19/05)

- Juego Preguntados conectado a API externa.
- Juego propio “Simón Dice” totalmente funcional.
- Listado de resultados: estadísticas por usuario y por juego.

En este sprint se enfocó el desarrollo en el juego Preguntados, que ahora consume una API externa para mostrar preguntas y opciones. También se completó la implementación del juego propio “Simón Dice”, incluyendo reglas claras y controles para iniciar la partida. Finalmente, se implementaron las vistas y componentes para mostrar los rankings y resultados de los distintos juegos, con persistencia y orden según puntajes, todo integrado con Supabase.

#### Tareas realizadas:

##### 🧠 Juego Preguntados:

- **Componente PreguntadosComponent:**

- Componente standalone con UI para mostrar preguntas, opciones y respuestas.
- Manejo del estado del juego para controlar preguntas, respuestas correctas e incorrectas.
- Integración con un servicio que consume la API externa para obtener preguntas dinámicas (sino el json o backup de preguntas).
- Guardado del desempeño del jugador en Supabase (partidas_preguntados), con puntaje y fecha.

##### 🎨 Juego propio “Simón Dice”:

- **Componente SimonComponent**

- Secuencia visual de colores que se ilumina en orden creciente.
- Permite seleccionar dificultad (Lento, Medio, Rápido) que afecta la velocidad de la secuencia.
- Controles para iniciar juego, repetir secuencia y verificar respuesta del usuario.
- Guarda la partida con puntaje en la tabla partidas_simon en Supabase.
- Explicación clara de las reglas incluida en la sección “Quién Soy” para mejor comprensión del usuario.

##### 📊 Listado de Resultados y Rankings:

- **Componente ResultadosComponent:**

- Permite seleccionar entre los cuatro juegos (Simón Dice, Preguntados, Mayor o Menor, Ahorcado) para ver rankings.
- Muestra tabla con los 10 mejores puntajes para el juego seleccionado, incluyendo nombre de usuario, puntaje y fecha.
- Componente TopJugadoresComponent reutilizable que consulta Supabase para obtener y ordenar los resultados.
- Actualización dinámica al cambiar el juego seleccionado y manejo de estados de carga y errores.

