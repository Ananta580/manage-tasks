import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
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
      title: 'Order',
      key: 'order',
      icon: 'low_priority',
    },
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

  selectedSortTab = 'order';

  tasks$!: Observable<Array<Task>>;

  constructor(private store: Store<State>, private router: Router) {}

  ngOnInit(): void {
    // Sort by order at first
    this.changeSortType('order');
  }

  changeTaskType(tab: string) {
    this.selectedTab = tab;
    switch (tab) {
      case 'todo':
        this.tasks$ = this.store
          .select((store) => store.task)
          .pipe(
            map((data) => {
              var filteredData = [];
              filteredData = [...data];
              filteredData = filteredData.filter((x) => x.done === false);
              return filteredData;
            })
          );
        break;
      case 'done':
        this.tasks$ = this.store
          .select((store) => store.task)
          .pipe(
            map((data) => {
              var filteredData = [];
              filteredData = [...data];
              filteredData = filteredData.filter((x) => x.done === true);
              return filteredData;
            })
          );
        break;
      default:
        this.changeSortType('order');
        break;
    }
  }

  changeSortType(tab: string) {
    this.selectedSortTab = tab;
    switch (tab) {
      case 'date':
        this.tasks$ = this.store
          .select((store) => store.task)
          .pipe(
            map((data) => {
              var sortData = [];
              sortData = [...data];
              sortData.sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              );
              return sortData;
            })
          );
        break;
      case 'group':
        this.tasks$ = this.store
          .select((store) => store.task)
          .pipe(
            map((data) => {
              var sortData = [];
              sortData = [...data];
              sortData.sort((x) => x.group?.name);
              return sortData;
            })
          );
        break;
      default:
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
