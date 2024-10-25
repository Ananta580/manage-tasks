import { inject, Injectable } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
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
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { Group } from 'src/app/models/group';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private afAuth = inject(Auth);
  private firestore = inject(Firestore);
  private collectionName = 'groups'; // You can define the collection name here

  private user: User | null = null; // Store authenticated user

  // Observe and cache authentication state once
  private user$ = new Observable<User | null>((observer) => {
    this.afAuth.onAuthStateChanged((user) => {
      this.user = user; // Cache the user
      observer.next(user);
    });
  });

  constructor() {}

  // Get groups in real-time
  getGroups(): Observable<Group[]> {
    return this.user$.pipe(
      switchMap((user) => {
        if (user && user.uid) {
          const groupsCollection = collection(
            this.firestore,
            `users/${user.uid}/${this.collectionName}`
          );
          const groupsQuery = query(groupsCollection);
          return new Observable<Group[]>((observer) => {
            onSnapshot(
              groupsQuery,
              (querySnapshot) => {
                const groups: Group[] = querySnapshot.docs.map(
                  (doc) => ({ uid: doc.id, ...doc.data() } as Group)
                );
                observer.next(groups);
              },
              (error) => observer.error(error)
            );
          });
        }
        return new Observable<Group[]>((observer) => observer.next([]));
      })
    );
  }

  // Add group
  addGroup(group: Group): Promise<void> {
    return this.performAuthenticatedAction(() => {
      const groupsCollection = collection(
        this.firestore,
        `users/${this.user?.uid}/${this.collectionName}`
      );
      return addDoc(groupsCollection, group);
    });
  }

  // Update group
  updateGroup(group: Group): Promise<void> {
    if (!group.uid) {
      return Promise.reject(new Error('Group UID is required for updating'));
    }
    return this.performAuthenticatedAction(() => {
      const groupDoc = doc(
        this.firestore,
        `users/${this.user?.uid}/${this.collectionName}/${group.uid}`
      );
      return updateDoc(groupDoc, { ...group });
    });
  }

  // Delete group
  deleteGroup(id: string): Promise<void> {
    return this.performAuthenticatedAction(() => {
      const groupDoc = doc(
        this.firestore,
        `users/${this.user?.uid}/${this.collectionName}/${id}`
      );
      return deleteDoc(groupDoc);
    });
  }

  // Helper method for authenticated actions
  private performAuthenticatedAction(action: () => Promise<any>): Promise<any> {
    return new Promise<void>((resolve, reject) => {
      if (this.user && this.user.uid) {
        action().then(resolve).catch(reject);
      } else {
        reject(new Error('User not authenticated'));
      }
    });
  }
}
