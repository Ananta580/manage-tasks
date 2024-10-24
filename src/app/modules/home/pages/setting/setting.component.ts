import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/firebase/auth.service';
import { LocalstorageService } from 'src/app/services/local.storage.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
})
export class SettingComponent {
  name!: string;
  user$ = this.localStorage.user$;
  isLocal = this.localStorage.isLocal;
  constructor(
    private localStorage: LocalstorageService,
    private toastService: ToastService,
    private authService: AuthService
  ) {
    this.name = this.isLocal
      ? this.localStorage.todo_local_username
      : this.localStorage.todo_cloud_user.name;
  }

  updateProfile() {
    if (this.isLocal) {
      this.localStorage.todo_local_username = this.name;
      this.toastService.showSuccess('User information updated successfully');
    } else {
      this.authService.updateUserInfo(this.name).then(() => {
        this.localStorage.todo_cloud_user = {
          ...this.localStorage.todo_cloud_user,
          name: this.name,
        };
        this.toastService.showSuccess('User information updated successfully');
      });
    }
  }
}
