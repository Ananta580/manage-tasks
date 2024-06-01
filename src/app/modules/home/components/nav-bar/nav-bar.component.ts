import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, interval, map } from 'rxjs';
import { LocalstorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit, OnDestroy {
  user$ = this.localStorage.user$;

  showSettingPopup = false;
  greeting?: string;

  dateSubject = new BehaviorSubject<Date>(new Date());
  currentDate$?: Observable<Date> = this.dateSubject;
  private subscription?: Subscription;
  constructor(
    private router: Router,
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

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  openSettingPopup() {
    this.showSettingPopup = true;
  }

  clearMyData() {
    localStorage.clear();
    this.router.navigateByUrl('/auth/login');
  }

  updateProfile() {
    this.router.navigateByUrl('/app/setting');
  }
}
