import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalstorageService {
  user$ = new BehaviorSubject<string>('');
  constructor() {
    this.user$.next(this.todo_local_username);
  }
  set todo_local_username(todo_local_username: string) {
    localStorage.setItem('todo_local_username', todo_local_username);
    this.user$.next(todo_local_username);
  }
  get todo_local_username() {
    return localStorage.getItem('todo_local_username') ?? '';
  }

  set theme(theme: string) {
    localStorage.setItem('theme', theme);
  }
  get theme() {
    return localStorage.getItem('theme') ?? '';
  }
}
