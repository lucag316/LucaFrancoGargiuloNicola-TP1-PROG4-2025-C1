
import { Injectable } from "@angular/core";
import { CanActivate, Router} from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginRedirectGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const isLogged = await this.authService.isLoggedIn();
    if (isLogged) {
      this.router.navigate(['/home']);
      return false;
    }
    return true;
  }
}