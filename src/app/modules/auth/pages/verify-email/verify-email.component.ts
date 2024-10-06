import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/firebase/auth.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
})
export class VerifyEmailComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // this.checkEmailVerified();
  }

  checkEmailVerified() {
    this.authService.checkEmailVerified().then((verified) => {
      if (verified) {
        this.router.navigate(['/auth/complete']);
      }
    });
  }

  resendEmail() {
    this.authService.verifyEmail();
  }
  ngOnDestroy() {}
}
