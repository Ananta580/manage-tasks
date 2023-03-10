import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalstorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
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
  }

  changeTaskType(tab: string) {
    this.selectedTab$.next(tab);
    this.localStorage.task_type = tab;
    this.localStorage.changedType();
  }

  addNewTask() {
    this.localStorage.newTask$.next(true);
  }
}
