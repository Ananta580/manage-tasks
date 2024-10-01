import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  selectedStorageType = 'local';

  storageTypes = [
    {
      label: 'Local Storage',
      value: 'local',
      icon: 'browser_updated',
      features: [
        `Offline Access: Manage tasks without an internet connection, ensuring privacy and quick access.`,
        `Instant Setup: No sign-in required; start organizing your tasks immediately!`,
      ],
    },
    {
      label: 'Cloud Storage',
      value: 'cloud',
      icon: 'cloud_upload',
      features: [
        `Access Anywhere: Sign in to view and manage tasks from any device with seamless synchronization.`,
        `Cloud Backup: Securely store your tasks online, ensuring they’re safe and accessible anytime.`,
      ],
    },
  ];
  name!: string;

  registerForm: FormGroup = new FormGroup({
    displayName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private localStorage: LocalstorageService,
    private router: Router,
    private authService: AuthService
  ) {}

  get selectedStorageFeatures() {
    return this.storageTypes.find(
      (storage) => storage.value === this.selectedStorageType
    )?.features;
  }

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
      if (this.selectedStorageType === 'local') {
        this.localStorage.username = this.name;
        this.router.navigateByUrl('/');
      } else {
        this.authService.signup(this.registerForm.value).then(() => {
          this.authService.verifyEmail().then(() => {
            this.router.navigateByUrl('/verify-email');
          });
        });
      }
    }, 500);
  }
}
