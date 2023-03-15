import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  name!: string;
  constructor(
    private localStorage: LocalstorageService,
    private router: Router
  ) {}

  doLogin() {
    this.localStorage.username = this.name;
    this.router.navigateByUrl('/');
  }
}
