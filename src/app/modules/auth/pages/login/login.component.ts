import { Component } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/firebase/auth.service';
import { LocalstorageService } from 'src/app/services/local.storage.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  showModal = false;
  switchMessage = '';

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
      [{ transform: 'translateX(0)' }, { transform: 'translateX(200px)' }],
      {
        duration: 1000,
        fill: 'forwards',
      }
    );
    setTimeout(() => {
      this.authService
        .login(this.loginForm.value)
        .then((auth) => {
          if (auth) {
            this.localStorage.isLocal = false;
            if (JSON.parse(localStorage.getItem('tasks') ?? '[]').length > 0) {
              this.switchMessage = `Hey <b class="text-gray-500">${this.loginForm.value?.email}</b>, You have some data in your local storage, do you want to sync it to the online version.`;
              this.showModal = true;
              return;
            } else {
              this.switchOnline(false);
            }
          }
        })
        .catch((error) => {
          const arrow = document.getElementById('login-arrow') as any;
          if (arrow) {
            setTimeout(() => {
              arrow.style.setProperty('transform', 'none', 'important');
            }, 900);
          }
        });
    }, 100);
  }

  switchOnline(confirm: boolean) {
    if (confirm) {
      this.authService.switchOnline();
      this.toastService.showSuccess(
        'Welcome back! We have synced your local data into cloud.'
      );
      this.router.navigate(['/']);
    } else {
      localStorage.removeItem('tasks');
      localStorage.removeItem('groups');
      this.toastService.showSuccess(
        'Welcome back! You have successfully logged in.'
      );
      this.router.navigate(['/']);
    }
  }
}
