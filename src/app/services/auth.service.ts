import { inject, Injectable } from '@angular/core';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  UserCredential,
} from '@angular/fire/auth';
import { User, UserLogin, UserRegister } from '../store/models/user';
import { BehaviorSubject, delay } from 'rxjs';
import { LocalstorageService } from './localstorage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _firestore = inject(Firestore);
  private _auth = inject(Auth);

  private _userSubject = new BehaviorSubject<User | null>(null);
  user$ = this._userSubject.asObservable();

  constructor(private localStorageService: LocalstorageService) {}

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
        console.log('currentUser', currentUser);
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
      this._userSubject.next(user);
      this.localStorageService.todo_cloud_user = user;
      return user;
    } catch (error: any) {
      if (
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/invalid-email' ||
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/user-disabled' ||
        error.code === 'auth/too-many-requests' ||
        error.code === 'auth/operation-not-allowed'
      ) {
        let message = '';
        switch (error.code) {
          case 'auth/wrong-password':
            message = 'Incorrect password. Please try again.';
            break;
          case 'auth/invalid-email':
            message = 'Invalid email address. Please check and try again.';
            break;
          case 'auth/user-not-found':
            message = 'No user found with this email. Please sign up first.';
            break;
          case 'auth/user-disabled':
            message =
              'This user account has been disabled. Please contact support.';
            break;
          case 'auth/too-many-requests':
            message = 'Too many login attempts. Please try again later.';
            break;
          case 'auth/operation-not-allowed':
            message =
              'Login with email and password is not enabled. Please contact support.';
            break;
        }
        alert(`Authentication error: ${message}`);
      } else {
        console.error('Login error:', error);
      }
      return null;
    }
  }

  private async _setUserData(user: User): Promise<User> {
    const userDocRef = doc(this._firestore, `users/${user.uid}`);
    await setDoc(userDocRef, user);
    return user;
  }
}
