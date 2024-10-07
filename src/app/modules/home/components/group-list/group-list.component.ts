import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { Group } from 'src/app/models/group';
import { GroupStorageService } from 'src/app/services/group.storage.service';
import { uid } from 'uid';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
})
export class GroupListComponent implements OnInit {
  groups$!: Observable<Array<Group>>;
  showModal = false;

  maxId = 0;
  groupForm: FormGroup;
  private destroy$ = new Subject<void>();

  editId: any = null;
  editUid: any = null;

  @Input() selectedGroup?: Group;

  @Output() groupSelected = new EventEmitter<Group | undefined>();
  constructor(
    private groupService: GroupStorageService,
    private fb: FormBuilder
  ) {
    this.groupForm = this.fb.group({
      name: ['', Validators.required],
      color: ['#000000'],
    });
  }

  ngOnInit(): void {
    this.groups$ = this.groupService.groups$;
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
      id: uid(),
      name: this.groupForm.get('name')?.value,
      color: this.groupForm.get('color')?.value,
    };
    this.groupSelected.emit(payload);
    this.groupService.addGroup(payload);
    // Reset Form
    this.groupForm.controls['name'].reset();
    this.showModal = false;
  }

  editGroup() {
    if (this.groupForm.invalid) {
      return;
    }
    const payload: Group = {
      uid: this.editUid,
      id: this.editId,
      name: this.groupForm.get('name')?.value,
      color: this.groupForm.get('color')?.value,
    };
    this.groupService.editGroup(payload);
    // Reset Form
    this.groupForm.reset();
    this.showModal = false;
    this.editId = null;
    this.editUid = null;
  }

  patchGroup(event: any, group: Group) {
    event.stopPropagation();
    this.editUid = group.uid;
    this.editId = group.id;
    this.groupForm.patchValue(group);
    this.showModal = true;
  }

  deleteGroup(event: any, group: Group) {
    event.stopPropagation();
    this.groupService.deleteGroup(group);
  }

  selectGroup(group: Group | undefined) {
    this.selectedGroup = group;
    this.groupSelected.emit(group);
  }
}
