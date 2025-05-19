
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { CanActivate, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})


export class AuthGuard implements CanActivate {


    constructor(private authService: AuthService, private router: Router) {}

    async canActivate(): Promise<boolean> {
        const isLogged = await this.authService.isLoggedIn();
        if (!isLogged) {
        this.router.navigate(['/login']);
        }
        return isLogged;
    }
}