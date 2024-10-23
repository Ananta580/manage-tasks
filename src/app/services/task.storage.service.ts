// src/app/services/task.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TaskService } from './firebase/task.service';
import { Task } from '../models/tasks';
import { LocalstorageService } from './local.storage.service';

@Injectable({
  providedIn: 'root',
})
export class TaskStorageService {
  // BehaviorSubject to hold the current state of tasks
  private tasksSubject = new BehaviorSubject<Array<Task>>([]);
  // Observable to expose the current state to components
  public tasks$ = this.tasksSubject.asObservable();

  constructor(
    private taskService: TaskService,
    private localStore: LocalstorageService
  ) {
    if (this.localStore.isLocal) {
      this.tasksSubject.next(JSON.parse(localStorage.getItem('tasks') ?? '[]'));
    } else {
      this.tasks$ = this.taskService.getTasks();
    }
  }

  getTaskById(taskId: string): Promise<Task | undefined> {
    if (this.localStore.isLocal) {
      const task = this.tasksSubject.value.find((task) => task.id == taskId);
      return Promise.resolve(task ? task : undefined);
    } else {
      return this.taskService.getTaskById(taskId);
    }
  }

  async getMaxOrder(): Promise<number | undefined> {
    if (this.localStore.isLocal) {
      const currentTasks = this.tasksSubject.value;
      return Promise.resolve(
        currentTasks.reduce((maxOrder, task) => {
          return task.order > maxOrder ? task.order : maxOrder;
        }, 0)
      );
    } else {
      return this.taskService.getMaxOrder();
    }
  }

  addTask(task: Task): void {
    if (this.localStore.isLocal) {
      const currentTasks = this.tasksSubject.value;
      const updatedTasks = [...currentTasks, task];
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      this.tasksSubject.next(updatedTasks);
    } else {
      this.taskService.addTask(task);
    }
  }

  editTask(updatedTask: Task): void {
    if (this.localStore.isLocal) {
      const currentTasks = this.tasksSubject.value;
      const newTasks = currentTasks.map((task) =>
        task.id == updatedTask.id ? { ...updatedTask } : task
      );
      localStorage.setItem('tasks', JSON.stringify(newTasks));
      this.tasksSubject.next(newTasks);
    } else {
      this.taskService.updateTask(updatedTask);
    }
  }

  deleteTask(task: Task): void {
    if (this.localStore.isLocal) {
      const currentTasks = this.tasksSubject.value;
      const newTasks = currentTasks.filter((task) => task.id !== task.id);
      localStorage.setItem('tasks', JSON.stringify(newTasks));
      this.tasksSubject.next(newTasks);
    } else {
      this.taskService.deleteTask(task.uid);
    }
  }

  deleteAllTasks() {
    return this.taskService.deleteAllTasks();
  }

  reorderTasks(prev: Task, current: Task): void {
    const currentTasks = this.tasksSubject.value;
    const prevIndex = currentTasks.findIndex((task) => task.id === prev.id);
    const currentIndex = currentTasks.findIndex(
      (task) => task.id === current.id
    );

    // Swap tasks
    const newTasks = [...currentTasks];
    [newTasks[prevIndex], newTasks[currentIndex]] = [
      newTasks[currentIndex],
      newTasks[prevIndex],
    ];

    if (this.localStore.isLocal) {
      localStorage.setItem('tasks', JSON.stringify(newTasks));
      this.tasksSubject.next(newTasks);
    } else {
      this.taskService.reorderTasks(prev, current);
    }
  }

  searchTasks(searchString: string): Array<Task> {
    const filteredTasks = this.tasksSubject.value.filter(
      (task) =>
        task.title?.toLowerCase().includes(searchString.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchString.toLowerCase())
    );
    return filteredTasks;
  }
}
