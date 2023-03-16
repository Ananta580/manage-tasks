import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AddGroupAction } from 'src/app/store/actions/group.actions';
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

  @Output() groupSelected = new EventEmitter<Group | undefined>();
  constructor(private store: Store<State>, private fb: FormBuilder) {
    this.groupForm = this.fb.group({
      name: ['', Validators.required],
      color: ['#408fea'],
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

  addGroup() {
    if (this.groupForm.invalid) {
      return;
    }
    console.log(this.maxId);
    const payload: Group = {
      id: this.maxId + 1,
      name: this.groupForm.get('name')?.value,
      color: this.groupForm.get('color')?.value,
    };
    this.store.dispatch(AddGroupAction({ payload }));
    this.loadGroup();
    // Reset Form
    this.groupForm.reset();
    this.showModal = false;
  }
}
