export interface UserRegister extends UserLogin {
  displayName: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface User {
  uid: string;
  name: string;
  email: string | null;
  emailVerified: boolean;
  password?: string;
  platformId: string;
}
