import { Component } from '@angular/core';
import { LocalstorageService } from './services/localstorage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'your-todo';
  selectedTab = 'all';
  constructor(private localStorage: LocalstorageService) {
    this.localStorage.tasks = this.localStorage.tasks.filter(
      (x) => new Date(x.date).toDateString() === new Date().toDateString()
    );
    this.localStorage.changedType();
  }
}
