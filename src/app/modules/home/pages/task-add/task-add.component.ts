import { Component } from '@angular/core';
interface Food {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-task-add',
  templateUrl: './task-add.component.html',
})
export class TaskAddComponent {
  isOpen = false;
}
