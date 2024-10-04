import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from './services/localstorage.service';
import { environment } from 'src/.env/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'your-todo';
  selectedTab = 'all';
  constructor(private localStorage: LocalstorageService) {}
  ngOnInit(): void {
    console.log(environment);
    if (this.localStorage.theme) {
      document.getElementsByTagName('html')[0].className =
        this.localStorage.theme;
    } else {
      const darkModeMatcher = window.matchMedia('(prefers-color-scheme: dark)');
      const theme = darkModeMatcher.matches ? 'dark' : 'light';
      this.localStorage.theme = theme;
    }
  }
}
