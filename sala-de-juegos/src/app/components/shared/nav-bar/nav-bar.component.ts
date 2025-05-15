import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { MatSnackBar }  from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { SupabaseService } from '../../../services/supabase/supabase.service';
import { UserService } from '../../../services/user/user.service';
import { AuthService } from '../../../services/auth/auth.service';


@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
  standalone: true
})
export class NavBarComponent implements OnInit, OnDestroy {

  usuarioLogueado: boolean = false;
  private authSub!: Subscription;

  username: string | null = null;
  rutaActual: string = '';

  menuAbierto: boolean = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.rutaActual = this.router.url;

  // ✅ Escuchar los cambios de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.rutaActual = event.url;
    });

    // Suscribirse al estado de autenticación
    this.authSub = this.authService.authStatus$.subscribe(status => {
      this.usuarioLogueado = status;
      
      if (status) {
        this.obtenerNombreUsuario(); // Llama a la función async
      } else {
        this.username = null;
      }
      
  });

  

    try {
      await this.userService.initialize();
      await this.authService.checkAuthStatus(); // Esto ya actualiza el estado real
    } catch (error) {
        console.error('Error inicializando Supabase:', error);
    }
  }

  private async obtenerNombreUsuario() {
    try {
      const { id } = await this.authService.getUserIdMail();

      const { data, error } = await this.userService['supabaseService'].client
        .from('users')
        .select('username')
        .eq('id', id)
        .single();

      if (!error && data?.username) {
        this.username = data.username;
      } else {
        this.username = 'Usuario';
      }
    } catch (err) {
      console.error('Error obteniendo el nombre de usuario:', err);
      this.username = 'Usuario';
    }
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarSesion() {
    this.authService.logout();
  }

  irALogin() {
  this.router.navigateByUrl('/login');
  }

  irARegister() {
    this.router.navigateByUrl('/register');
  }
  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }
}