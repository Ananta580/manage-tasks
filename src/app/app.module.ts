import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { TaskReducer } from './store/reducers/task.reducer';
import { GroupReducer } from './store/reducers/group.reducer';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({ task: TaskReducer, group: GroupReducer }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
