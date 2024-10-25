import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
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
import { debounceTime, distinctUntilChanged, Observable } from 'rxjs';
import { Task } from '../../models/tasks';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  afAuth = inject(Auth);
  firestore = inject(Firestore);
  private collectionName = 'tasks';

  constructor() {}

  async getTaskById(id: string): Promise<Task | undefined> {
    const user = this.afAuth.currentUser;
    if (user && user.uid) {
      const taskDoc = doc(
        this.firestore,
        `users/${user.uid}/${this.collectionName}/${id}`
      );
      const docSnapshot = await getDoc(taskDoc);
      if (docSnapshot.exists()) {
        return { uid: docSnapshot.id, ...docSnapshot.data() } as Task;
      }
    }
    return undefined;
  }

  async getMaxOrder(): Promise<number | undefined> {
    const user = this.afAuth.currentUser;
    if (user && user.uid) {
      const tasksCollection = collection(
        this.firestore,
        `users/${user.uid}/${this.collectionName}`
      );
      const tasksQuery = query(tasksCollection);
      const querySnapshot = await getDocs(tasksQuery);
      let maxOrder = 0;
      querySnapshot.forEach((doc) => {
        const task = doc.data() as Task;
        if (maxOrder === undefined || task.order > maxOrder) {
          maxOrder = task.order;
        }
      });
      return maxOrder;
    }
    return undefined;
  }

  getTasks(searchString: string = ''): Observable<Task[]> {
    return new Observable<Task[]>((observer) => {
      this.afAuth.onAuthStateChanged((user) => {
        if (user && user.uid) {
          const tasksCollection = collection(
            this.firestore,
            `users/${user.uid}/${this.collectionName}`
          );
          const tasksQuery = query(tasksCollection);
          onSnapshot(
            tasksQuery,
            (querySnapshot) => {
              const tasks: Task[] = querySnapshot.docs
                .map((doc) => ({ uid: doc.id, ...doc.data() } as Task))
                .filter((task) =>
                  task.title.toLowerCase().includes(searchString.toLowerCase())
                );
              observer.next(tasks);
            },
            (error) => observer.error(error)
          );
        } else {
          observer.next([]);
        }
      });
    });
  }

  addTask(task: Task) {
    return new Promise<void>((resolve, reject) => {
      this.afAuth.onAuthStateChanged((user) => {
        if (user && user.uid) {
          const tasksCollection = collection(
            this.firestore,
            `users/${user.uid}/${this.collectionName}`
          );
          addDoc(tasksCollection, task)
            .then(() => resolve())
            .catch((error: any) => reject(error));
        } else {
          reject(new Error('User not authenticated'));
        }
      });
    });
  }

  updateTask(task: Task) {
    return new Promise<void>((resolve, reject) => {
      this.afAuth.onAuthStateChanged((user) => {
        if (user && user.uid) {
          if (!task.uid) {
            reject(new Error('Task ID is required for updating'));
            return;
          }
          const taskDoc = doc(
            this.firestore,
            `users/${user.uid}/${this.collectionName}/${task.uid}`
          );
          updateDoc(taskDoc, { ...task })
            .then(() => resolve())
            .catch((error: any) => reject(error));
        } else {
          reject(new Error('User not authenticated'));
        }
      });
    });
  }

  reorderTasks(task1: Task, task2: Task) {
    return new Promise<void>((resolve, reject) => {
      this.afAuth.onAuthStateChanged((user) => {
        if (user && user.uid) {
          const batch = writeBatch(this.firestore);
          const task1Ref = doc(
            this.firestore,
            `users/${user.uid}/${this.collectionName}/${task1.uid}`
          );
          const task2Ref = doc(
            this.firestore,
            `users/${user.uid}/${this.collectionName}/${task2.uid}`
          );

          batch.update(task1Ref, { order: task1.order });
          batch.update(task2Ref, { order: task2.order });

          batch
            .commit()
            .then(() => resolve())
            .catch((error) => reject(error));
        } else {
          reject(new Error('User not authenticated'));
        }
      });
    });
  }
  deleteTask(id: string) {
    return new Promise<void>((resolve, reject) => {
      this.afAuth.onAuthStateChanged((user) => {
        if (user && user.uid) {
          const taskDoc = doc(
            this.firestore,
            `users/${user.uid}/${this.collectionName}/${id}`
          );
          deleteDoc(taskDoc)
            .then(() => resolve())
            .catch((error) => reject(error));
        } else {
          reject(new Error('User not authenticated'));
        }
      });
    });
  }

  deleteAllTasks() {
    return new Promise<void>((resolve, reject) => {
      this.afAuth.onAuthStateChanged(async (user) => {
        if (user && user.uid) {
          try {
            const tasksCollection = collection(
              this.firestore,
              `users/${user.uid}/${this.collectionName}`
            );
            const tasksSnapshot = await getDocs(tasksCollection);

            const batch = writeBatch(this.firestore);
            tasksSnapshot.forEach((doc) => {
              batch.delete(doc.ref);
            });

            await batch.commit();
            resolve();
          } catch (error) {
            console.error('Error deleting tasks:', error);
            reject(error);
          }
        }
      });
    });
  }

  searchTasks(searchString: string): Observable<Task[]> {
    return new Observable<Task[]>((observer) => {
      this.afAuth.onAuthStateChanged((user) => {
        if (user && user.uid) {
          const tasksCollection = collection(
            this.firestore,
            `users/${user.uid}/${this.collectionName}`
          );
          const tasksQuery = query(tasksCollection);
          onSnapshot(
            tasksQuery,
            (querySnapshot) => {
              const tasks: Task[] = querySnapshot.docs
                .map((doc) => ({ uid: doc.id, ...doc.data() } as Task))
                .filter((task) =>
                  task.title.toLowerCase().includes(searchString.toLowerCase())
                );
              observer.next(tasks);
            },
            (error) => observer.error(error)
          );
        } else {
          observer.next([]);
        }
      });
    }).pipe(debounceTime(300), distinctUntilChanged());
  }
}
