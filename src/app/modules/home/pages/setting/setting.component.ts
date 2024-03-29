import { Component } from '@angular/core';
import { LocalstorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
})
export class SettingComponent {
  name!: string;

  user$ = this.localStorage.user$;
  constructor(private localStorage: LocalstorageService) {
    this.name = this.localStorage.username;
  }

  updateProfile() {
    this.localStorage.username = this.name;
    this.localStorage.user$.next(this.name);
  }
}
