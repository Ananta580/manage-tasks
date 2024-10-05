import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../store/models/user';

@Injectable({
  providedIn: 'root',
})
export class LocalstorageService {
  user$ = new BehaviorSubject<User | null>(null);
  constructor() {
    if (this.todo_cloud_user) {
      this.user$.next(this.todo_cloud_user);
    } else if (this.todo_local_username) {
      this.user$.next({ name: this.todo_local_username } as any);
    }
  }
  set todo_local_username(todo_local_username: string) {
    localStorage.setItem('todo_local_username', todo_local_username);
    this.user$.next({ name: this.todo_local_username } as any);
  }

  get todo_local_username() {
    return localStorage.getItem('todo_local_username') ?? '';
  }

  set todo_cloud_user(todo_cloud_user: User) {
    localStorage.setItem('todo_cloud_user', JSON.stringify(todo_cloud_user));
    this.user$.next({ name: this.todo_cloud_user } as any);
  }

  get todo_cloud_user() {
    return JSON.parse(localStorage.getItem('todo_cloud_user') ?? 'null');
  }

  set theme(theme: string) {
    localStorage.setItem('theme', theme);
  }
  get theme() {
    return localStorage.getItem('theme') ?? '';
  }
}
