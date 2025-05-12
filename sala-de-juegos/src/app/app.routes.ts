

// Importación del tipo Routes para definir las rutas del enrutador de Angular.
import { Routes } from '@angular/router';

// Importación de los componentes que se utilizarán en las rutas.
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { QuienSoyComponent } from './pages/quien-soy/quien-soy.component';
import { ChatComponent } from './pages/chat/chat.component';
import { AhorcadoComponent } from './pages/juegos/ahorcado/ahorcado.component';
import { MayorOMenorComponent } from './pages/juegos/mayor-o-menor/mayor-o-menor.component';
import { PreguntadosComponent } from './pages/juegos/preguntados/preguntados.component';
import { SimonComponent } from './pages/juegos/simon/simon.component';


export const routes: Routes = [

    {
        path: '', 
        redirectTo: 'home', 
        pathMatch: 'full',
    },
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'register',
        component: RegisterComponent,
    },
    {
        path: 'quien-soy',
        component: QuienSoyComponent,
    },
    {
        path: 'chat',
        component: ChatComponent,
    },
    {
        path: 'ahorcado',
        component: AhorcadoComponent,
    },
    {
        path: 'mayor-o-menor',
        component: MayorOMenorComponent,
    },
    {
        path: 'preguntados',
        component: PreguntadosComponent,
    },
    {
        path: 'simon',
        component: SimonComponent,
    },
    {
        path: '**',
        redirectTo: 'home',
    }

];
