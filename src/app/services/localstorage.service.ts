import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalstorageService {
  user$ = new BehaviorSubject<string>('');
  constructor() {
    this.user$.next(this.username);
  }
  set username(username: string) {
    localStorage.setItem('username', username);
    this.user$.next(username);
  }
  get username() {
    return localStorage.getItem('username') ?? '';
  }

  set theme(theme: string) {
    localStorage.setItem('theme', theme);
  }
  get theme() {
    return localStorage.getItem('theme') ?? '';
  }
}
