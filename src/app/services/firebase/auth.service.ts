import { inject, Injectable } from '@angular/core';
import {
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  setDoc,
} from '@angular/fire/firestore';
import {
  Auth,
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  sendEmailVerification,
  signInWithEmailAndPassword,
  UserCredential,
  reauthenticateWithCredential,
} from '@angular/fire/auth';
import { User, UserLogin, UserRegister } from '../../models/user';
import { BehaviorSubject } from 'rxjs';
import { LocalstorageService } from '../local.storage.service';
import { ToastService } from '../toast.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _firestore = inject(Firestore);
  private _auth = inject(Auth);

  private _userSubject = new BehaviorSubject<User | null>(null);
  user$ = this._userSubject.asObservable();

  constructor(
    private localStorageService: LocalstorageService,
    private toastService: ToastService
  ) {}

  async signup(user: UserRegister): Promise<UserCredential> {
    // TODO: Error handling
    const auth = await createUserWithEmailAndPassword(
      this._auth,
      user.email.trim(),
      user.password.trim()
    );
    let dbUser: User = {
      uid: auth.user.uid,
      emailVerified: false,
      email: user.email,
      platformId: '',
      name: user.displayName,
      password: user.password,
    };
    this._setUserData(dbUser);

    return auth;
  }

  verifyEmail(): Promise<void> {
    return sendEmailVerification(this._auth.currentUser!);
  }

  async checkEmailVerified(): Promise<boolean> {
    return new Promise((resolve) => {
      // Added timeout because of the delay in auth loading
      setTimeout(async () => {
        const currentUser = this._auth.currentUser;
        if (currentUser && currentUser.emailVerified) {
          const userDocRef = doc(this._firestore, `users/${currentUser.uid}`);
          const userDoc = await getDoc(userDocRef);
          const userData = userDoc.data() as User;
          await this.login({
            email: currentUser.email || '',
            password: userData.password ?? '',
          });
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  }

  async login(login: UserLogin): Promise<User | null> {
    try {
      const auth = await signInWithEmailAndPassword(
        this._auth,
        login.email.trim(),
        login.password.trim()
      );
      const userDocRef = doc(this._firestore, `users/${auth.user.uid}`);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data() as User;
      const user: User = {
        ...auth.user,
        password: userData.password,
        name: userData.name,
        platformId: userData.platformId || '',
      };
      delete user.password;
      this.localStorageService.todo_cloud_user = user;
      return user;
    } catch (error: any) {
      this._handleLoginError(error);
      return null;
    }
  }

  private _handleLoginError(error: any): void {
    const errorMessages: { [key: string]: string } = {
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/invalid-email':
        'Invalid email address. Please check and try again.',
      'auth/invalid-credential':
        'Invalid credentials. Please check and try again.',
      'auth/missing-password':
        'Invalid password. Please enter password and try again.',
      'auth/user-not-found':
        'No user found with this email. Please sign up first.',
      'auth/user-disabled':
        'This user account has been disabled. Please contact support.',
      'auth/too-many-requests':
        'Too many login attempts. Please try again later.',
      'auth/operation-not-allowed':
        'Login with email and password is not enabled. Please contact support.',
    };

    const message =
      errorMessages[error.code] ||
      'An unknown error occurred. Please try again.';
    this.toastService.showError(message);
    console.error('Login error:', error);
  }

  private async _setUserData(user: User): Promise<User> {
    const userDocRef = doc(this._firestore, `users/${user.uid}`);
    await setDoc(userDocRef, user);
    return user;
  }

  deleteAccount(password: string) {
    return new Promise<void>((resolve, reject) => {
      this._auth.onAuthStateChanged(async (user) => {
        if (user && user.uid) {
          try {
            // Delete the user document
            const userDoc = doc(this._firestore, `users/${user.uid}`);
            const userDB = await getDoc(userDoc);
            if (password != userDB.data()?.['password']) {
              reject('PASS-WRONG');
            }
            // await deleteDoc(userDoc);

            // try {
            //   await user.delete();
            // } catch (error: any) {
            //   if (error.code === 'auth/requires-recent-login') {
            //     // Re-authenticate the user
            //     const credential = EmailAuthProvider.credential(
            //       user.email!,
            //       password
            //     );
            //     await reauthenticateWithCredential(user, credential);
            //     await user.delete();
            //   } else {
            //     throw error;
            //   }
            // }

            // this._auth.signOut();
            resolve();
          } catch (error) {
            console.error('Error deleting user:', error);
            reject(error);
          }
        }
      });
    });
  }

  updateUserInfo(name: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this._auth.onAuthStateChanged(async (currentUser) => {
        if (currentUser && currentUser.uid) {
          try {
            const userDocRef = doc(this._firestore, `users/${currentUser.uid}`);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              const userData = userDoc.data() as User;
              const updatedUser = { ...userData, name: name };
              await setDoc(userDocRef, updatedUser, { merge: true });
              resolve();
            } else {
              reject(new Error('User document does not exist.'));
            }
          } catch (error) {
            console.error('Error updating user info:', error);
            reject(error);
          }
        } else {
          reject(new Error('No authenticated user found.'));
        }
      });
    });
  }
}
