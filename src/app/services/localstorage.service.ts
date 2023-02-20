import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Task } from '../models/tasks';

@Injectable({
  providedIn: 'root',
})
export class LocalstorageService {
  taskType$ = new BehaviorSubject<any>('all');
  tasks$ = new BehaviorSubject<any>([]);
  newTask$ = new BehaviorSubject<any>(false);

  constructor() {
    this.taskType$.next(this.task_type);
    this.changedType();
  }

  changedType() {
    this.taskType$.next(this.task_type);
    this.taskType$.subscribe({
      next: (type) => {
        if (type === 'all') {
          this.tasks$.next(
            this.tasks.sort((a, b) => {
              return (
                new Date(b.date).getSeconds() - new Date(a.date).getSeconds()
              );
            })
          );
        }
        if (type === 'done') {
          this.tasks$.next(
            this.tasks
              .filter((x) => x.done)
              .sort((a, b) => {
                return (
                  new Date(b.date).getSeconds() - new Date(a.date).getSeconds()
                );
              })
          );
        }
        if (type === 'todo') {
          this.tasks$.next(
            this.tasks
              .filter((x) => !x.done)
              .sort((a, b) => {
                return (
                  new Date(b.date).getSeconds() - new Date(a.date).getSeconds()
                );
              })
          );
        }
      },
    });
  }

  get task_type() {
    // Default returns all
    return localStorage.getItem('task_type') || 'all';
  }

  set task_type(task_type: string) {
    localStorage.setItem('task_type', task_type);
  }

  get tasks() {
    // Default pass empty array
    return JSON.parse(localStorage.getItem('tasks') || '[]');
  }

  set tasks(tasks: Task[]) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}
