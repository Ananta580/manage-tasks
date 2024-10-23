import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
})
export class ToastComponent {
  @Input() message: any;
  @Input() type: any;
  constructor(private toastService: ToastService) {}
  close() {
    this.toastService.close();
  }
}
