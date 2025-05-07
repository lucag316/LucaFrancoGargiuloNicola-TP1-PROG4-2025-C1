import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatSnackBar }  from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { SupabaseService } from '../../services/supabase.service';

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

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit(): Promise<void> {
    // Suscribirse al estado de autenticación
  this.authSub = this.supabaseService.authStatus$.subscribe(status => {
    this.usuarioLogueado = status;
  });

  try {
    await this.supabaseService.initialize();
    await this.supabaseService.checkAuthStatus(); // Esto ya actualiza el estado real
  } catch (error) {
      console.error('Error inicializando Supabase:', error);
  }
  }

  cerrarSesion() {
    this.supabaseService.logout();
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }
}