import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  onSnapshot,
  query,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Group } from 'src/app/models/group';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  afAuth = inject(Auth);
  firestore = inject(Firestore);
  constructor() {}

  getGroups(): Observable<Group[]> {
    return new Observable<Group[]>((observer) => {
      this.afAuth.onAuthStateChanged((user) => {
        if (user && user.uid) {
          const groupsCollection = collection(
            this.firestore,
            `users/${user.uid}/groups`
          );
          const groupsQuery = query(groupsCollection);
          onSnapshot(
            groupsQuery,
            (querySnapshot) => {
              console.log('Changed');
              const groups: Group[] = querySnapshot.docs.map(
                (doc) => ({ uid: doc.id, ...doc.data() } as Group)
              );
              observer.next(groups);
            },
            (error) => observer.error(error)
          );
        } else {
          observer.next([]);
        }
      });
    });
  }

  addGroup(group: Group) {
    return new Promise<void>((resolve, reject) => {
      this.afAuth.onAuthStateChanged((user) => {
        if (user && user.uid) {
          const groupsCollection = collection(
            this.firestore,
            `users/${user.uid}/groups`
          );
          addDoc(groupsCollection, group)
            .then(() => resolve())
            .catch((error) => reject(error));
        } else {
          reject(new Error('User not authenticated'));
        }
      });
    });
  }

  updateGroup(group: Group) {
    return new Promise<void>((resolve, reject) => {
      this.afAuth.onAuthStateChanged((user) => {
        if (user && user.uid) {
          if (!group.uid) {
            reject(new Error('Group UID is required for updating'));
            return;
          }
          const groupDoc = doc(
            this.firestore,
            `users/${user.uid}/groups/${group.uid}`
          );
          updateDoc(groupDoc, { ...group })
            .then(() => resolve())
            .catch((error) => reject(error));
        } else {
          reject(new Error('User not authenticated'));
        }
      });
    });
  }

  deleteGroup(id: string) {
    console.log(id);
    return new Promise<void>((resolve, reject) => {
      this.afAuth.onAuthStateChanged((user) => {
        if (user && user.uid) {
          const groupDoc = doc(
            this.firestore,
            `users/${user.uid}/groups/${id}`
          );
          deleteDoc(groupDoc)
            .then(() => resolve())
            .catch((error) => reject(error));
        }
      });
    });
  }
}
