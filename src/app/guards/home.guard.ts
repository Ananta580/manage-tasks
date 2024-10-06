import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { map, Observable } from 'rxjs';
import { LocalstorageService } from '../services/local.storage.service';
import { AuthService } from '../services/firebase/auth.service';

@Injectable({
  providedIn: 'root',
})
export class HomeGuard implements CanActivate {
  constructor(
    private localStorage: LocalstorageService,
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (
      this.localStorage.todo_cloud_user ||
      this.localStorage.todo_local_username
    ) {
      return true;
    } else {
      this.router.navigateByUrl('/auth/register');
      return false;
    }
  }
}
