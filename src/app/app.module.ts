import { NgModule } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { environment } from './../.env/environment';
import { AppComponent } from './app.component';
import { HomeGuard } from './auth.guard';
import { GroupReducer } from './store/reducers/group.reducer';
import { TaskReducer } from './store/reducers/task.reducer';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({ task: TaskReducer, group: GroupReducer }),
  ],
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideRouter([
      {
        path: '',
        redirectTo: 'app',
        pathMatch: 'full',
      },
      {
        path: 'app',
        canActivate: [HomeGuard],
        loadChildren: () =>
          import('src/app/modules/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('src/app/modules/auth/auth.module').then((m) => m.AuthModule),
      },
    ]),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
