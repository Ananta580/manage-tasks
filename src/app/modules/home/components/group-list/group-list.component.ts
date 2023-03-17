import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  AddGroupAction,
  DeleteGroupAction,
  EditGroupAction,
} from 'src/app/store/actions/group.actions';
import { Group } from 'src/app/store/models/group';
import { State } from 'src/app/store/models/state.model';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
})
export class GroupListComponent implements OnInit {
  groups$!: Observable<Array<Group>>;
  showModal = false;

  maxId = 0;
  groupForm: FormGroup;

  editId: any = null;

  @Input() selectedGroup = null;

  @Output() groupSelected = new EventEmitter<Group | undefined>();
  constructor(private store: Store<State>, private fb: FormBuilder) {
    this.groupForm = this.fb.group({
      name: ['', Validators.required],
      color: ['#000000'],
    });
  }

  ngOnInit(): void {
    this.groups$ = this.store.select((store) => store.group);
    this.loadGroup();
  }

  loadGroup() {
    this.groups$.subscribe({
      next: (res) => {
        if (res.length > 0) {
          this.maxId = Math.max(...res.map((o) => o.id));
        }
      },
    });
  }

  closeModal() {
    this.showModal = false;
    this.groupForm.reset();
    this.editId = null;
  }

  addGroup() {
    if (this.groupForm.invalid) {
      return;
    }
    const payload: Group = {
      id: this.maxId + 1,
      name: this.groupForm.get('name')?.value,
      color: this.groupForm.get('color')?.value,
    };
    this.groupSelected.emit(payload);
    this.store.dispatch(AddGroupAction({ payload }));
    // Reset Form
    this.groupForm.reset();
    this.showModal = false;
  }

  editGroup() {
    if (this.groupForm.invalid) {
      return;
    }
    const payload: Group = {
      id: this.editId,
      name: this.groupForm.get('name')?.value,
      color: this.groupForm.get('color')?.value,
    };
    this.store.dispatch(EditGroupAction({ payload }));
    // Reset Form
    this.groupForm.reset();
    this.showModal = false;
    this.editId = null;
  }

  patchGroup(group: Group) {
    this.editId = group.id;
    this.groupForm.patchValue(group);
    this.showModal = true;
  }

  deleteGroup(group: Group) {
    const payload = group.id;
    this.store.dispatch(DeleteGroupAction({ payload }));
  }
}
