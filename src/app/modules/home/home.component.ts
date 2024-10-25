import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/firebase/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  showModal = false;
  switchMessage = '';

  ngOnInit(): void {
    if (
      JSON.parse(localStorage.getItem('tasks') ?? '[]').length > 0 ||
      JSON.parse(localStorage.getItem('groups') ?? '[]').length > 0
    ) {
      this.switchMessage = `<b class="text-gray-500">Hey</b>, You have some data in your local storage, do you want to sync it to the online version.`;
      this.showModal = true;
      return;
    } else {
      this.switchOnline(false);
    }
  }

  switchOnline(confirm: boolean) {
    if (confirm) {
      this.authService.switchOnline();
      this.toastService.showSuccess(
        'All done! We have synced your local data into cloud.'
      );
      this.router.navigate(['/']);
    } else {
      localStorage.removeItem('tasks');
      localStorage.removeItem('groups');
    }
  }
}
