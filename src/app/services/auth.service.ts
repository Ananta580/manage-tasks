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
import { User, UserRegister } from '../store/models/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _firestore = inject(Firestore);
  private _auth = inject(Auth);

  byGoogle(): Promise<UserCredential> {
    return signInWithPopup(this._auth, new GoogleAuthProvider()).then(
      (auth) => {
        this._setUserData(auth);
        return auth;
      }
    );
  }

  verifyEmail(): Promise<void> {
    return sendEmailVerification(this._auth.currentUser!);
  }

  signup(user: UserRegister): Promise<UserCredential> {
    return createUserWithEmailAndPassword(
      this._auth,
      user.email.trim(),
      user.password.trim()
    ).then((auth) => {
      this._setUserData({
        ...auth,
        user: { ...auth.user, displayName: user.displayName },
      });
      return auth;
    });
  }

  private _userSubject = new BehaviorSubject<User | null>(null);
  user$ = this._userSubject.asObservable();

  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(
      this._auth,
      email.trim(),
      password.trim()
    ).then(async (auth) => {
      const userDocRef = doc(this._firestore, `users/${auth.user.uid}`);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data() as User;

      const user: User = {
        id: auth.user.uid,
        name: userData.name,
        email: auth.user.email!,
        emailVerified: auth.user.emailVerified,
        platformId: userData.platformId || '',
        lang: userData.lang || '',
      };
      this._userSubject.next(user);
      return auth;
    });
  }

  private _setUserData(auth: UserCredential): Promise<User> {
    const user: User = {
      id: auth.user.uid,
      name: (auth.user.displayName || auth.user.email)!,
      email: auth.user.email!,
      emailVerified: auth.user.emailVerified,
      platformId: '',
      lang: '',
    };
    const userDocRef = doc(this._firestore, `users/${user.id}`);
    return setDoc(userDocRef, user).then(() => user);
  }
}
