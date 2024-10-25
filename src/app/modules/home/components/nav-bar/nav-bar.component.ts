import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/firebase/auth.service';
import { LocalstorageService } from 'src/app/services/local.storage.service';
import { TaskStorageService } from 'src/app/services/task.storage.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit, OnDestroy {
  user$ = this.localStorage.user$;
  showSettingPopup = false;
  showModal = false;
  isAccountDelete = false;

  greeting?: string;
  isLocal = this.localStorage.isLocal;

  password?: string;

  deleteAccountMessage =
    'Are you sure you want to delete your account? This action is irreversible and will permanently delete all your data from the application.';
  deleteTasksMessage =
    'Are you sure you want to delete all your tasks? This action is irreversible and will permanently delete all your tasks from the application.';

  theme = this.localStorage.theme;

  dateSubject = new BehaviorSubject<Date>(new Date());
  currentDate$?: Observable<Date> = this.dateSubject;
  private subscription?: Subscription;
  constructor(
    public router: Router,
    private toastService: ToastService,
    private taskService: TaskStorageService,
    private localStorage: LocalstorageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.greeting = this.getGreeting();
    setInterval(() => {
      this.dateSubject.next(new Date());
    }, 1000);
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Good morning';
    } else if (hour < 18) {
      return 'Good afternoon';
    } else if (hour < 21) {
      return 'Good evening';
    } else {
      return 'Good night';
    }
  }
  getUserInitials(name: string): string {
    if (!name) return '';
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('');
    return initials.toUpperCase();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  openSettingPopup() {
    this.showSettingPopup = true;
  }

  showDeleteAccountPopup() {
    this.isAccountDelete = true;
    this.showSettingPopup = false;
    this.showModal = true;
  }

  showClearTaskPopup() {
    this.isAccountDelete = false;
    this.showSettingPopup = false;
    this.showModal = true;
  }

  switchOnline() {
    // Redirect to SignUp page with cloud, and after logged in success, check, if there is localstorage data, if any, move it to global,
    this.router.navigateByUrl('/auth/register');
  }

  clearMyData() {
    if (this.isLocal) {
      if (this.isAccountDelete) {
        localStorage.clear();
        this.toastService.showSuccess('User account deleted successfully.');
        this.router.navigateByUrl('/auth/login');
      } else {
        localStorage.removeItem('tasks');
        this.taskService.nullifyTask();
        this.toastService.showSuccess('All tasks deleted successfully.');
      }
      this.showModal = false;
      this.isAccountDelete = false;
    } else {
      if (this.isAccountDelete) {
        // Delete account and table of user from DB
        this.authService
          .deleteAccount(this.password ?? '')
          .then(() => {
            localStorage.clear();
            this.toastService.showSuccess('User account deleted successfully.');
            this.router.navigateByUrl('/auth/login');
          })
          .catch((err) => {
            this.password = '';
            if (err === 'PASS-WRONG') {
              this.toastService.showError(
                'Sorry, your password is wrong! Try again.'
              );
              return;
            }
            this.toastService.showError(
              'There was some error while deleting user.'
            );
          });
      } else {
        this.taskService.deleteAllTasks().then(() => {
          localStorage.removeItem('tasks');
          this.toastService.showSuccess('All tasks deleted successfully.');
          this.showModal = false;
          this.isAccountDelete = false;
        });
      }
    }
  }

  updateProfile() {
    this.showSettingPopup = false;
    this.router.navigateByUrl('/app/setting');
  }

  changeTheme() {
    if (this.theme == 'dark') {
      this.theme = 'light';
    } else if (this.theme == 'light') {
      this.theme = 'dark';
    }

    document.getElementsByTagName('html')[0].className = this.theme;
    this.localStorage.theme = this.theme;
  }

  searchTask(input: any) {
    this.taskService.searchTasks(input.target.value.toLowerCase());
  }

  logout() {
    this.authService.logout();
    localStorage.removeItem('todo_cloud_user');
    this.router.navigateByUrl('/auth/login');
  }
}
