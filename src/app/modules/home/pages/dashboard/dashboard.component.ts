import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Task } from 'src/app/models/tasks';
import { LocalstorageService } from 'src/app/services/local.storage.service';
import { TaskStorageService } from 'src/app/services/task.storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  tabs = [
    { title: 'All', key: 'all', icon: 'date_range' },
    { title: 'To do', key: 'todo', icon: 'calendar_today' },
    { title: 'Done', key: 'done', icon: 'event_available' },
  ];

  sortTabs = [
    { title: 'Order', key: 'order', icon: 'low_priority' },
    { title: 'Date', key: 'date', icon: 'calendar_month' },
    { title: 'Groups', key: 'group', icon: 'workspaces' },
  ];

  selectedTab = 'all';
  selectedSortTab = 'order';
  tasks$!: Observable<Task[]>;
  activeMenu: Task | null = null;
  confirmingDelete: Task | null = null;

  constructor(
    private taskService: TaskStorageService,
    private router: Router,
    private localStorage: LocalstorageService
  ) {}

  ngOnInit(): void {
    this.updateTasks();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateTasks() {
    this.tasks$ = this.taskService.tasks$.pipe(
      takeUntil(this.destroy$),
      map((data) => {
        let filteredData = [...data];
        if (this.selectedTab === 'todo') {
          filteredData = filteredData.filter((task) => !task.done);
        } else if (this.selectedTab === 'done') {
          filteredData = filteredData.filter((task) => task.done);
        }

        switch (this.selectedSortTab) {
          case 'date':
            return filteredData.sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );
          case 'group':
            return filteredData.sort((a, b) =>
              (a.group?.name || '').localeCompare(b.group?.name || '')
            );
          default: // 'order'
            return filteredData.sort((a, b) => a.order - b.order);
        }
      })
    );
  }

  changeTaskType(tab: string) {
    this.selectedTab = tab;
    this.updateTasks();
  }

  changeSortType(tab: string) {
    this.selectedSortTab = tab;
    this.updateTasks();
  }

  changeStatus(task: Task) {
    const updatedTask = { ...task, done: !task.done, animate: !task.done };
    this.taskService.editTask(updatedTask);

    if (updatedTask.animate) {
      setTimeout(() => {
        this.taskService.editTask({ ...updatedTask, animate: false });
      }, 1000);
    }
  }

  editTask(task: Task) {
    this.router.navigateByUrl(
      `/app/task/${this.localStorage.isLocal ? task.id : task.uid}`
    );
  }

  drop(event: any) {
    const prevIndex = event.previousIndex;
    const currentIndex = event.currentIndex;

    this.tasks$.pipe(take(1)).subscribe((res) => {
      const prevItem = res[prevIndex];
      const currentItem = res[currentIndex];

      const tempOrder = prevItem.order;
      prevItem.order = currentItem.order;
      currentItem.order = tempOrder;

      this.taskService.reorderTasks(prevItem, currentItem);
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
