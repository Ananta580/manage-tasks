import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideRouter, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { StartingComponent } from './pages/starting/starting.component';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';
import { LoginGuard } from 'src/app/guards/login.guard';
import { RegisterGuard } from 'src/app/guards/register.guard';
import { MatIconModule } from '@angular/material/icon';
import { VerifyEmailGuard } from 'src/app/guards/verify-email.guard';

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    StartingComponent,
    VerifyEmailComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MatIconModule,
  ],
  providers: [
    provideRouter([
      {
        path: '',
        component: AuthComponent,
        children: [
          {
            path: 'login',
            component: LoginComponent,
            canActivate: [LoginGuard],
          },
          {
            path: 'register',
            component: RegisterComponent,
            canActivate: [RegisterGuard],
          },
          {
            path: 'verify-email',
            component: VerifyEmailComponent,
            canActivate: [VerifyEmailGuard],
          },
          {
            path: 'complete',
            component: StartingComponent,
            canActivate: [VerifyEmailGuard],
          },
        ],
      },
    ]),
  ],
})
export class AuthModule {}
