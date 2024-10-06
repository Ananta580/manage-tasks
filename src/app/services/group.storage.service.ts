import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GroupService } from 'src/app/services/firebase/group.service';
import { Group } from '../models/group';
import { LocalstorageService } from './local.storage.service';

@Injectable({
  providedIn: 'root',
})
export class GroupStorageService {
  private groupsSubject = new BehaviorSubject<Array<Group>>([]);
  public groups$ = this.groupsSubject.asObservable();

  constructor(
    private groupService: GroupService,
    private localStore: LocalstorageService
  ) {
    if (this.localStore.isLocal) {
      this.groupsSubject.next(
        JSON.parse(localStorage.getItem('groups') ?? '[]')
      );
      return;
    }
    this.groups$ = this.groupService.getGroups();
  }

  addGroup(group: Group): void {
    if (this.localStore.isLocal) {
      const currentGroups = this.groupsSubject.value;
      const updatedGroups = [...currentGroups, group];
      localStorage.setItem('groups', JSON.stringify(updatedGroups));
      this.groupsSubject.next(updatedGroups);
    } else {
      this.groupService.addGroup(group);
    }
  }

  editGroup(updatedGroup: Group): void {
    if (this.localStore.isLocal) {
      const currentGroups = this.groupsSubject.value;
      const newGroups = currentGroups.map((group) =>
        group.id === updatedGroup.id ? { ...updatedGroup } : group
      );
      localStorage.setItem('groups', JSON.stringify(newGroups));
      this.groupsSubject.next(newGroups);
    } else {
      this.groupService.updateGroup(updatedGroup);
    }
  }

  deleteGroup(group: Group): void {
    if (this.localStore.isLocal) {
      const currentGroups = this.groupsSubject.value;
      const newGroups = currentGroups.filter((g) => g.id !== group.id);
      localStorage.setItem('groups', JSON.stringify(newGroups));
      this.groupsSubject.next(newGroups);
    } else {
      this.groupService.deleteGroup(group.uid);
    }
  }
}
