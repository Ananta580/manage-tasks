import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Task } from 'src/app/models/tasks';
import { LocalstorageService } from 'src/app/services/local.storage.service';
import { TaskStorageService } from 'src/app/services/task.storage.service';

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

  tasks$!: Observable<Task[]>;

  activeMenu: Task | null = null; // To track the active menu
  confirmingDelete: Task | null = null; // To track the confirmation state

  constructor(
    private taskService: TaskStorageService,
    private router: Router,
    private localStorage: LocalstorageService
  ) {}

  ngOnInit(): void {
    // Sort by order at first
    this.changeSortType('order');
  }

  changeTaskType(tab: string) {
    this.selectedTab = tab;
    switch (tab) {
      case 'todo':
        this.tasks$ = this.taskService.tasks$.pipe(
          map((data) => {
            var filteredData = [];
            filteredData = [...data];
            filteredData = filteredData.filter((x) => x.done === false);
            return filteredData;
          })
        );
        break;
      case 'done':
        this.tasks$ = this.taskService.tasks$.pipe(
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
        this.tasks$ = this.taskService.tasks$.pipe(
          map((data) => {
            var sortData = [];
            sortData = [...data];
            sortData.sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );
            return sortData;
          })
        );
        break;
      case 'group':
        this.tasks$ = this.taskService.tasks$.pipe(
          map((data) => {
            var sortData = [];
            sortData = [...data];
            sortData.sort((x) => x.group?.name);
            return sortData;
          })
        );
        break;
      default:
        this.tasks$ = this.taskService.tasks$.pipe(
          map((data) => {
            var sortData = [...data];
            sortData.sort((a, b) => a.order - b.order);
            return sortData;
          })
        );
        break;
    }
  }

  changeStatus(task: Task) {
    const payload = {
      ...task,
      done: !task.done,
      animate: task.done ? false : true,
    };
    this.taskService.editTask(payload);

    if (payload.animate) {
      setTimeout(() => {
        const updatedPayload = { ...payload, animate: false };
        this.taskService.editTask(updatedPayload);
      }, 1000);
    }
  }

  editTask(task: Task) {
    this.router.navigateByUrl(
      `/app/task/${this.localStorage.isLocal ? task.id : task.uid}`
    );
  }

  drop(event: any) {
    var prev = event.previousIndex;
    var current = event.currentIndex;
    var prevItem: any = null;
    var currentItem: any = null;
    var sth = this.tasks$?.subscribe({
      next: (res) => {
        if (res) {
          prevItem = res[prev];
          currentItem = res[current];
          setTimeout(() => {
            var prevOrder = JSON.parse(JSON.stringify(prevItem.order));
            var currentOrder = JSON.parse(JSON.stringify(currentItem.order));
            prevItem.order = currentOrder;
            currentItem.order = prevOrder;
            this.taskService.reorderTasks(prevItem, currentItem);
            sth?.unsubscribe();
            this.changeSortType('order');
          }, 100);
        }
      },
    });
  }

  toggleMenu(task: Task): void {
    this.activeMenu = this.activeMenu === task ? null : task;
    this.confirmingDelete = null;
  }

  confirmDelete(task: Task): void {
    this.confirmingDelete = task;
    this.activeMenu = task;
  }

  closeMenu(): void {
    this.confirmingDelete = null;
    this.activeMenu = null;
  }

  deleteTask(task: Task): void {
    this.taskService.deleteTask(task);
    this.closeMenu();
  }
}
