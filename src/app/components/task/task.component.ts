import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from 'src/app/models/tasks';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent {
  taskName = '';
  taskType$ = new BehaviorSubject<any>([]);
  todoList$ = new BehaviorSubject<any>([]);
  newTask$ = new BehaviorSubject<any>(false);

  constructor(private localStorage: LocalstorageService) {
    this.todoList$ = this.localStorage.tasks$;
    this.newTask$ = this.localStorage.newTask$;
    this.taskType$ = this.localStorage.taskType$;
  }

  changedTask(id: any) {
    var tasks = this.localStorage.tasks;
    var task = tasks.find((x) => x.id === id);
    if (task) {
      task.done = !task.done;
    }
    var index = tasks.findIndex((x) => x.id === id);
    tasks[index] ?? task;
    this.localStorage.tasks = tasks;
    this.localStorage.tasks$.next(tasks);
    this.localStorage.changedType();
  }

  saveTask() {
    let task: Task = {
      id: uuidv4(),
      title: this.taskName,
      date: new Date().toString(),
      done: false,
    };
    var tasks = this.localStorage.tasks;
    tasks.push(task);
    this.localStorage.tasks = tasks;
    this.localStorage.tasks$.next(tasks);
    this.localStorage.newTask$.next(false);
    this.localStorage.task_type = 'todo';
    this.localStorage.changedType();
  }

  cancelTask() {
    this.localStorage.newTask$.next(false);
  }
}
