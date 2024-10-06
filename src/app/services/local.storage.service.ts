import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class LocalstorageService {
  user$ = new BehaviorSubject<User | null>(null);
  constructor() {
    if (this.todo_cloud_user) {
      this.user$.next(this.todo_cloud_user);
    } else if (this.todo_local_username) {
      this.user$.next({ name: this.todo_local_username } as User);
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
    this.user$.next(this.todo_cloud_user);
  }

  get todo_cloud_user() {
    return JSON.parse(
      localStorage.getItem('todo_cloud_user') ?? 'null'
    ) as User;
  }

  set theme(theme: string) {
    localStorage.setItem('theme', theme);
  }
  get theme() {
    return localStorage.getItem('theme') ?? '';
  }

  set isLocal(isLocal: boolean) {
    localStorage.setItem('isLocal', JSON.stringify(isLocal));
  }
  get isLocal() {
    return JSON.parse(localStorage.getItem('isLocal') ?? 'false') as boolean;
  }
}
