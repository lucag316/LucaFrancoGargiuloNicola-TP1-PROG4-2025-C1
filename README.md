
# Sala de Juegos 🎮



===


Aplicación interactiva desarrollada en Angular que permite a los usuarios ejercitar sus habilidades cognitivas y motrices a través de diversos juegos clásicos y uno original. Ofrece funcionalidades de autenticación, estadísticas personalizadas por jugador y por juego, chat en tiempo real, y una experiencia de usuario fluida y moderna.

---
## 📋 Indice
- [Información del Proyecto](#-información-del-proyecto)
- [Links importantes](#-links-importantes)
- [Objetivo general](#-objetivo-general)
- [Tecnologias utilizadas](#-tecnologias-utilizadas)
- [Caracteristicas principales](#-caracteristicas-principales)
- [Funcionalidades por Sprint](#-funcionalidades-por-sprint)
- [Sprint 1](#-sprint-1)
- [Sprint 2](#-sprint-2)
- [Sprint 3](#-sprint-3)
- [Sprint 4](#-sprint-4)
- [Sprint 5](#-sprint-5)

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

-🔗 **Repositorio GitHub**: *[https://sala-de-juegos-delta.vercel.app/]*

-🔗 **Deploy en Vercel**: *[https://sala-de-juegos-delta.vercel.app/]*

#### 🌐 Hosting del Proyecto

🔗 **Deploy online**: *[https://sala-de-juegos-delta.vercel.app/]*

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

### 📊 Estadísticas
- Historial completo de partidas
- Progreso por juego y usuario
- Tablas comparativas

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

## 📌 Notas importantes
- ❌ No usar `alert()` → ✅ Usar modales (PrimeNG o Bootstrap modals).
- ✔ Juegos con reglas claras de victoria / derrota.
- ✔ Navegación fluida y diseño uniforme.
- ✔ Mostrar tiempo y puntuación en juegos.

---


## Sprint 1 Resumen
Objetivo:
Crear la estructura base de la aplicación, habilitar la navegación entre las pantallas principales y configurar el acceso a la API de GitHub para mostrar los datos del alumno en el componente "Quién Soy". Además, se implementa un favicon propio y un diseño inicial de la aplicación.

Tareas principales:
Creación del proyecto Angular: Inicializar el proyecto y configurarlo para el despliegue.

Componentes: Implementar los componentes Login, Registro, Bienvenida/Home, Quién Soy.

Navegación: Establecer rutas para navegar entre los componentes.

GitHub API: Usar la API de GitHub para mostrar el nombre, la imagen y los datos del alumno en el componente "Quién Soy".

Favicon propio: Incluir un favicon personalizado para la aplicación.

---

## 🧑‍💼 Funcionalidades por Sprint

### 🟢 Sprint 1 (28/04)
- Creación del proyecto y deploy inicial.
- Componentes base: Login, Registro, Home, Quién Soy.
- Navegación funcional entre componentes.
- API GitHub: mostrar datos del alumno en “Quién Soy”.
- Favicon personalizado.
- Descripción detallada del juego propio.

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

---