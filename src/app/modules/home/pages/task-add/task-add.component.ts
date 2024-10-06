import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from 'src/app/models/tasks';
import { TaskStorageService } from 'src/app/services/task.storage.service';
import { uid } from 'uid';
@Component({
  selector: 'app-task-add',
  templateUrl: './task-add.component.html',
})
export class TaskAddComponent implements OnInit {
  isOpen = false;
  taskForm: FormGroup;

  taskId: any = null;
  editTaskPlaceholder!: Task;
  constructor(
    private fb: FormBuilder,
    private taskService: TaskStorageService,
    private router: Router,
    private _route: ActivatedRoute
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      group: [null],
    });
  }

  get group() {
    return this.taskForm.get('group') as any;
  }

  ngOnInit(): void {
    this.taskId = this._route.snapshot.paramMap.get('id') ?? null;
    this.loadTask();
  }

  setGroup(group: any) {
    this.group?.setValue(group);
    this.isOpen = false;
  }

  loadTask() {
    if (this.taskId) {
      console.log(this.taskId);
      this.taskService.getTaskById(this.taskId).then((data) => {
        if (data) {
          this.editTaskPlaceholder = data;
          this.taskForm.patchValue(data);
        }
      });
    }
  }

  saveTask() {
    if (this.taskForm.invalid) {
      return;
    }
    if (this.taskId) {
      this.editTask();
    } else {
      this.addTask();
    }
  }

  async addTask() {
    const { value } = this.taskForm;
    const payload: Task = {
      id: uid(),
      ...value,
      done: false,
      date: new Date(),
      order: ((await this.taskService.getMaxOrder()) ?? 0) + 1,
    };
    console.log(payload);
    this.taskService.addTask(payload);
    this.router.navigateByUrl('/');
  }

  editTask() {
    const { value } = this.taskForm;
    const payload: Task = {
      id: Number(this.taskId),
      uid: this.editTaskPlaceholder.uid,
      ...value,
      done: this.editTaskPlaceholder.done,
      date: this.editTaskPlaceholder.date,
      order: this.editTaskPlaceholder.order,
    };
    console.log(payload);
    this.taskService.editTask(payload);
    this.router.navigateByUrl('/');
  }
}
