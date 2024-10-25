import { inject, Injectable } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  writeBatch,
} from '@angular/fire/firestore';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  switchMap,
} from 'rxjs';
import { Task } from '../../models/tasks';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private afAuth = inject(Auth);
  private firestore = inject(Firestore);
  private collectionName = 'tasks';

  private searchSubject = new BehaviorSubject<string>(''); // Search string BehaviorSubject
  private user: User | null = null; // Store authenticated user

  // Observe and cache authentication state once
  private user$ = new Observable<User | null>((observer) => {
    this.afAuth.onAuthStateChanged((user) => {
      this.user = user; // Cache the user
      observer.next(user);
    });
  });

  constructor() {}

  updateSearch(searchString: string) {
    this.searchSubject.next(searchString);
  }

  // Get task by ID
  async getTaskById(id: string): Promise<Task | undefined> {
    if (this.user && this.user.uid) {
      const taskDoc = doc(
        this.firestore,
        `users/${this.user.uid}/${this.collectionName}/${id}`
      );
      const docSnapshot = await getDoc(taskDoc);
      if (docSnapshot.exists()) {
        return { uid: docSnapshot.id, ...docSnapshot.data() } as Task;
      }
    }
    return undefined;
  }

  // Get the highest task order
  async getMaxOrder(): Promise<number | undefined> {
    if (this.user && this.user.uid) {
      const tasksCollection = collection(
        this.firestore,
        `users/${this.user.uid}/${this.collectionName}`
      );
      const tasksQuery = query(tasksCollection);
      const querySnapshot = await getDocs(tasksQuery);
      let maxOrder = 0;
      querySnapshot.forEach((doc) => {
        const task = doc.data() as Task;
        maxOrder = Math.max(maxOrder, task.order);
      });
      return maxOrder;
    }
    return undefined;
  }

  // Get filtered tasks in real-time
  getFilteredTasks(): Observable<Task[]> {
    return this.user$.pipe(
      switchMap((user) => {
        if (user && user.uid) {
          const tasksCollection = collection(
            this.firestore,
            `users/${user.uid}/${this.collectionName}`
          );
          const tasksQuery = query(tasksCollection);

          const tasksObservable = new Observable<Task[]>((tasksObserver) => {
            onSnapshot(
              tasksQuery,
              (querySnapshot) => {
                const tasks: Task[] = querySnapshot.docs.map(
                  (doc) => ({ uid: doc.id, ...doc.data() } as Task)
                );
                tasksObserver.next(tasks);
              },
              (error) => tasksObserver.error(error)
            );
          });

          // Combine tasks and search filtering
          return combineLatest([
            tasksObservable,
            this.searchSubject.asObservable(),
          ]).pipe(
            debounceTime(300),
            distinctUntilChanged(),
            map(([tasks, searchString]) => {
              return tasks.filter((task: Task) =>
                task.title.toLowerCase().includes(searchString.toLowerCase())
              );
            })
          );
        } else {
          return new Observable<Task[]>((observer) => observer.next([]));
        }
      })
    );
  }

  // Add task
  addTask(task: Task) {
    return new Promise<void>((resolve, reject) => {
      if (this.user && this.user.uid) {
        const tasksCollection = collection(
          this.firestore,
          `users/${this.user.uid}/${this.collectionName}`
        );
        addDoc(tasksCollection, task)
          .then(() => resolve())
          .catch(reject);
      } else {
        reject(new Error('User not authenticated'));
      }
    });
  }

  // Update task
  updateTask(task: Task) {
    return new Promise<void>((resolve, reject) => {
      if (this.user && this.user.uid && task.uid) {
        const taskDoc = doc(
          this.firestore,
          `users/${this.user.uid}/${this.collectionName}/${task.uid}`
        );
        updateDoc(taskDoc, { ...task })
          .then(resolve)
          .catch(reject);
      } else {
        reject(new Error('User not authenticated or Task ID is missing'));
      }
    });
  }

  // Reorder tasks
  reorderTasks(task1: Task, task2: Task) {
    return new Promise<void>((resolve, reject) => {
      if (this.user && this.user.uid) {
        const batch = writeBatch(this.firestore);
        const task1Ref = doc(
          this.firestore,
          `users/${this.user.uid}/${this.collectionName}/${task1.uid}`
        );
        const task2Ref = doc(
          this.firestore,
          `users/${this.user.uid}/${this.collectionName}/${task2.uid}`
        );
        batch.update(task1Ref, { order: task1.order });
        batch.update(task2Ref, { order: task2.order });

        batch.commit().then(resolve).catch(reject);
      } else {
        reject(new Error('User not authenticated'));
      }
    });
  }

  // Delete task
  deleteTask(id: string) {
    return new Promise<void>((resolve, reject) => {
      if (this.user && this.user.uid) {
        const taskDoc = doc(
          this.firestore,
          `users/${this.user.uid}/${this.collectionName}/${id}`
        );
        deleteDoc(taskDoc).then(resolve).catch(reject);
      } else {
        reject(new Error('User not authenticated'));
      }
    });
  }

  // Delete all tasks
  deleteAllTasks() {
    return new Promise<void>((resolve, reject) => {
      if (this.user && this.user.uid) {
        const tasksCollection = collection(
          this.firestore,
          `users/${this.user.uid}/${this.collectionName}`
        );
        getDocs(tasksCollection)
          .then((tasksSnapshot) => {
            const batch = writeBatch(this.firestore);
            tasksSnapshot.forEach((doc) => batch.delete(doc.ref));
            return batch.commit();
          })
          .then(resolve)
          .catch(reject);
      } else {
        reject(new Error('User not authenticated'));
      }
    });
  }
}
