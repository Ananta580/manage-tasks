import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalstorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  username: string = '';
  constructor(private localStorage: LocalstorageService) {
    this.username = this.localStorage.username;
  }
}
