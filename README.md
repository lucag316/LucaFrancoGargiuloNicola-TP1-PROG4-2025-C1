
# Sala de Juegos 🎮

Aplicación interactiva desarrollada en Angular que permite a los usuarios ejercitar sus habilidades cognitivas y motrices a través de diversos juegos clásicos y uno original. Ofrece funcionalidades de autenticación, estadísticas personalizadas por jugador y por juego, chat en tiempo real, y una experiencia de usuario fluida y moderna.

---

## 📋 Indice
- [Sala de Juegos 🎮](#sala-de-juegos-)
  - [📋 Indice](#-indice)
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

Desarrollar una plataforma web que permita a los usuarios registrados ingresar a una sala de juegos, jugar diferentes propuestas lúdicas, ver sus estadísticas, y comunicarse mediante un sistema de chat en tiempo real. El proyecto se divide en 4 sprints semanales con funcionalidades entregadas de forma incremental.

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

El juego muestra al usuario una secuencia de colores que debe memorizar y repetir.
Cada vez que el usuario acierta, la secuencia se alarga agregando un color nuevo.
Si el usuario se equivoca en cualquier paso, el juego se reinicia desde el principio.
La idea es lograr repetir la mayor cantidad de colores seguidos sin fallar.


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

### 🔵 Sprint 3 (12/05)

- Implementación de juegos: Ahorcado y Mayor o Menor.
- Guardado de información de partidas.
- Chat en tiempo real: mensajes diferenciados según usuario.

### 🔴 Sprint 4 (19/05)

- Juego Preguntados conectado a API externa.
- Juego propio “Simón Dice” totalmente funcional.
- Listado de resultados: estadísticas por usuario y por juego.

### ⚫ Sprint 5 (Recuperatorio - Opcional)

- Encuesta validada con múltiples tipos de campos.
- Guardado de respuestas por usuario.
- Visualización de resultados solo por administradores (con guards).
- Animaciones de transición entre componentes.
