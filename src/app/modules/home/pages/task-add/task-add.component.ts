import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import {
  AddTaskAction,
  EditTaskAction,
} from 'src/app/store/actions/tasks.actions';
import { State } from 'src/app/store/models/state.model';
import { Task } from 'src/app/store/models/tasks';
@Component({
  selector: 'app-task-add',
  templateUrl: './task-add.component.html',
})
export class TaskAddComponent implements OnInit {
  isOpen = false;
  maxId = 0;
  maxOrder = 0;
  taskForm: FormGroup;

  taskId: any = null;
  editTaskPlaceholder!: Task;
  constructor(
    private fb: FormBuilder,
    private store: Store<State>,
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
    this.store
      .select((store) => store.task)
      .subscribe({
        next: (res) => {
          if (res.length > 0) {
            this.maxId = Math.max(...res.map((o) => o.id));
            this.maxOrder = Math.max(...res.map((o) => o.order));
          }
          if (this.taskId) {
            this.editTaskPlaceholder = res.find((x) => x.id == this.taskId)!;
            this.taskForm.patchValue(this.editTaskPlaceholder);
          }
        },
      });
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

  addTask() {
    const { value } = this.taskForm;
    const payload: Task = {
      id: this.maxId + 1,
      ...value,
      done: false,
      date: new Date(),
      order: this.maxOrder + 1,
    };
    this.store.dispatch(AddTaskAction({ payload }));
    this.router.navigateByUrl('/');
  }

  editTask() {
    const { value } = this.taskForm;
    const payload: Task = {
      id: Number(this.taskId),
      ...value,
      done: this.editTaskPlaceholder.done,
      date: this.editTaskPlaceholder.date,
      order: this.editTaskPlaceholder.order,
    };
    console.log(payload);
    this.store.dispatch(EditTaskAction({ payload }));
    this.router.navigateByUrl('/');
  }
}
