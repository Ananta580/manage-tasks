export interface UserRegister {
  displayName: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  platformId: string;
  lang: string;
}
