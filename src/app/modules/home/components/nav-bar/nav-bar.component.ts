import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  user$ = this.localStorage.user$;

  showSettingPopup = false;
  constructor(
    private router: Router,
    private localStorage: LocalstorageService
  ) {}

  openSettingPopup() {
    this.showSettingPopup = true;
  }

  clearMyData() {
    localStorage.clear();
    this.router.navigateByUrl('/auth/login');
  }

  updateProfile() {
    this.router.navigateByUrl('/app/setting');
  }
}
