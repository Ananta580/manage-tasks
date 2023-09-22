import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, tap } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  DeleteTaskAction,
  EditTaskAction,
  ReorderTaskAction,
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

  sortTabs = [
    {
      title: 'Date',
      key: 'date',
      icon: 'calendar_month',
    },
    {
      title: 'Groups',
      key: 'group',
      icon: 'workspaces',
    },
  ];

  selectedTab = 'all';

  selectedSortTab = 'date';

  tasks$!: Observable<Array<Task>>;

  constructor(private store: Store<State>, private router: Router) {}

  ngOnInit(): void {
    // Sort by order
    this.loadTasks();
  }

  loadTasks() {
    this.tasks$ = this.store
      .select((store) => store.task)
      .pipe(
        map((data) => {
          var sortData = [];
          sortData = [...data];
          sortData.sort((a, b) => {
            return a.order < b.order ? -1 : 1;
          });
          return sortData;
        })
      );
  }

  changeTaskType(tab: string) {
    this.selectedTab = tab;
    // TODO: Show only task of that type;
  }

  changeSortType(tab: string) {
    // TODO: Sort tasks by these types
    this.selectedSortTab = tab;
    switch (tab) {
      case 'date':
        this.tasks$ = this.store
          .select((store) => store.task)
          .pipe(
            map((data) => {
              data.sort((a, b) => {
                return a.order < b.order ? -1 : 1;
              });
              return data;
            })
          );
        break;
      case 'group':
        this.tasks$ = this.store
          .select((store) => store.task)
          .pipe(
            tap((results) => {
              results.sort((x) => x.group?.name);
            })
          );
        break;
    }
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

  drop(event: any) {
    var prev = event.previousIndex;
    var current = event.currentIndex;
    var prevItem: any = null;
    var currentItem: any = null;
    var sth = this.tasks$.subscribe({
      next: (res) => {
        prevItem = { ...res.find((x) => x.order == prev + 1) };
        currentItem = { ...res.find((x) => x.order == current + 1) };
      },
    });
    setTimeout(() => {
      var prevOrder = JSON.parse(JSON.stringify(prevItem.order));
      var currentOrder = JSON.parse(JSON.stringify(currentItem.order));
      prevItem.order = currentOrder;
      currentItem.order = prevOrder;
      this.store.dispatch(
        ReorderTaskAction({ payload: [prevItem, currentItem] })
      );
      sth.unsubscribe();
    }, 100);
  }
}
