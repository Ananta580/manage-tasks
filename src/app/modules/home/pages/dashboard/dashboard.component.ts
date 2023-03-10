import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from 'src/app/models/tasks';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  taskName = '';
  taskType$ = new BehaviorSubject<any>([]);
  todoList$ = new BehaviorSubject<any>([]);
  newTask$ = new BehaviorSubject<any>(false);
  selectedTab$ = new BehaviorSubject<any>('all');
  tabs = [
    {
      title: 'All',
      key: 'all',
      icon: 'date_range',
    },
    {
      title: 'To do',
      key: 'todo',
      icon: 'calendar_today',
    },
    {
      title: 'Done',
      key: 'done',
      icon: 'event_available',
    },
  ];

  constructor(private localStorage: LocalstorageService) {
    this.selectedTab$ = this.localStorage.taskType$;
    this.todoList$ = this.localStorage.tasks$;
    this.newTask$ = this.localStorage.newTask$;
    this.taskType$ = this.localStorage.taskType$;
  }

  changeTaskType(tab: string) {
    this.selectedTab$.next(tab);
    this.localStorage.task_type = tab;
    this.localStorage.changedType();
  }

  addNewTask() {
    this.localStorage.newTask$.next(true);
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
    if (task?.done) {
      this.localStorage.task_type = 'done';
    } else {
      this.localStorage.task_type = 'todo';
    }
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
