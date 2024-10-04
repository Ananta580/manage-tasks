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
import { ToastService } from './toast.service';

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
      this._userSubject.next(user);
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
}
