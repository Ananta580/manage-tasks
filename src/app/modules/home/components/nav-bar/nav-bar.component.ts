import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subscription, interval, map } from 'rxjs';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { searchTaskAction } from 'src/app/store/actions/tasks.actions';
import { State } from 'src/app/store/models/state.model';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit, OnDestroy {
  user$ = this.localStorage.user$;
  showSettingPopup = false;
  showModal = false;
  greeting?: string;

  theme = this.localStorage.theme;

  dateSubject = new BehaviorSubject<Date>(new Date());
  currentDate$?: Observable<Date> = this.dateSubject;
  private subscription?: Subscription;
  constructor(
    private router: Router,
    private store: Store<State>,
    private localStorage: LocalstorageService
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

  showClearDataPopup() {
    this.showSettingPopup = false;
    this.showModal = true;
  }

  clearMyData() {
    localStorage.clear();
    this.router.navigateByUrl('/auth/login');
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
    this.store.dispatch(
      searchTaskAction({ payload: input.target.value.toLowerCase() })
    );
  }
}
