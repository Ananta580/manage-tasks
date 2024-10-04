import { Component } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private localStorage: LocalstorageService,
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService
  ) {}

  doLogin() {
    const arrow = document.getElementById('login-arrow') as any;
    arrow?.animate(
      [{ transform: 'translateX(0)' }, { transform: 'translateX(100px)' }],
      {
        duration: 500,
        fill: 'forwards',
      }
    );
    setTimeout(() => {
      this.authService
        .login(this.loginForm.value)
        .then((auth) => {
          if (auth) {
            this.toastService.showSuccess('Login successfull');
            this.router.navigate(['/']);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }, 500);
  }
}
