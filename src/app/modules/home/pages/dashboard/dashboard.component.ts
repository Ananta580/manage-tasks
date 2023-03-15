import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  DeleteTaskAction,
  EditTaskAction,
} from 'src/app/store/actions/tasks.actions';
import { State } from 'src/app/store/models/state.model';
import { Task } from 'src/app/store/models/tasks';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
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

  selectedTab = 'all';

  tasks$!: Observable<Array<Task>>;

  constructor(private store: Store<State>, private router: Router) {}

  changeTaskType(tab: string) {
    this.selectedTab = tab;
  }

  ngOnInit(): void {
    this.tasks$ = this.store.select((store) => store.task);
  }

  changeStatus(task: Task) {
    var payload = { ...task };
    payload.done = !payload.done;
    this.store.dispatch(EditTaskAction({ payload }));
  }

  editTask(id: number) {
    this.router.navigateByUrl(`/app/task/${id}`);
  }

  deleteTask(id: number) {
    const payload = id;
    this.store.dispatch(DeleteTaskAction({ payload }));
  }

  drop(event: any) {}
}
