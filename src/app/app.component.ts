import { Component } from '@angular/core';
import { LocalstorageService } from './services/localstorage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'your-todo';
  selectedTab = 'all';
  constructor(private localStorage: LocalstorageService) {}
}
