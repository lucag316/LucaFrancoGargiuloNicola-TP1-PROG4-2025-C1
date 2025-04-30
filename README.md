
# Sala de Juegos 🎮



Aplicación interactiva desarrollada en Angular que permite a los usuarios ejercitar sus habilidades cognitivas y motrices a través de diversos juegos clásicos y uno original. Ofrece funcionalidades de autenticación, estadísticas personalizadas por jugador y por juego, chat en tiempo real, y una experiencia de usuario fluida y moderna.


## 👨‍💻 Información del Alumno
- **Nombres**: Luca Franco
- **Apellidos**: Gargiulo Nicola
- **Materia**: Programación IV
- **Nivel**: 4° Cuatrimestre 
- **Comisión**: 2025 C1
- **Tipo de Examen**: Primer Parcial

---

## 🔗 Enlaces importantes

🔗 **Repositorio GitHub**: *[https://sala-de-juegos-delta.vercel.app/]*
🔗 **Deploy en Vercel**: *[https://sala-de-juegos-delta.vercel.app/]*

## 🌐 Hosting del Proyecto

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

## 🚀 Funcionalidades por Sprint

### ✅ Sprint 1
- Creación del proyecto y deploy en hosting.
- Componentes: Login, Registro, Bienvenida/Home, Quién Soy.
- Navegación entre componentes.
- Quién Soy: Traer datos desde GitHub API ([https://api.github.com/users/USERNAME](https://api.github.com/users/USERNAME)).
- Mostrar nombre, imagen y datos.
- Explicación clara del juego propio.
- Favicon propio.

*(Los próximos sprints se irán detallando a medida que se desarrollen)*

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