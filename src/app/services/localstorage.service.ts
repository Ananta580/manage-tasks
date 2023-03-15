import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalstorageService {
  constructor() {}
  set username(username: string) {
    localStorage.setItem('username', username);
  }
  get username() {
    return localStorage.getItem('username') ?? '';
  }
}
