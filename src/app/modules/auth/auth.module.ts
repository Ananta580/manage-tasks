import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { StartingComponent } from './pages/starting/starting.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  provideRouter,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    StartingComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  providers: [
    provideRouter([
      {
        path: '',
        component: AuthComponent,
        children: [
          {
            path: 'login',
            component: LoginComponent,
          },
          {
            path: 'register',
            component: RegisterComponent,
          },
          {
            path: 'complete',
            component: StartingComponent,
          },
        ],
      },
    ]),
  ],
})
export class AuthModule {}
