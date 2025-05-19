

// Importación del tipo Routes para definir las rutas del enrutador de Angular.
import { Routes } from '@angular/router';

// Importación de los componentes que se utilizarán en las rutas.
import { HomeComponent } from './components/pages/home/home.component';
import { LoginComponent } from './components/pages/login/login.component';
import { RegisterComponent } from './components/pages/register/register.component';
import { QuienSoyComponent } from './components/pages/quien-soy/quien-soy.component';
import { ChatComponent } from './components/pages/chat/chat.component';
import { AhorcadoComponent } from './components/pages/juegos/ahorcado/ahorcado.component';
import { MayorOMenorComponent } from './components/pages/juegos/mayor-o-menor/mayor-o-menor.component';
import { PreguntadosComponent } from './components/pages/juegos/preguntados/preguntados.component';
import { SimonComponent } from './components/pages/juegos/simon/simon.component';
import { ResultadosComponent } from './components/pages/resultados/resultados.component';


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
        path: 'resultados',
        component: ResultadosComponent,
    },
    {
        path: '**',
        redirectTo: 'home',
    }

];
