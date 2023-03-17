import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { OverlayModule } from '@angular/cdk/overlay';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HomeRoutingModule } from './home-routing.module';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { HomeComponent } from './home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskAddComponent } from './pages/task-add/task-add.component';
import { StoreModule } from '@ngrx/store';
import { TaskReducer } from 'src/app/store/reducers/task.reducer';
import { GroupListComponent } from './components/group-list/group-list.component';
import { SharedModule } from '../shared/shared.module';
import { SettingComponent } from './pages/setting/setting.component';

@NgModule({
  declarations: [
    HomeComponent,
    NavBarComponent,
    DashboardComponent,
    TaskAddComponent,
    GroupListComponent,
    SettingComponent,
  ],
  imports: [
    CommonModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatSnackBarModule,
    DragDropModule,
    SharedModule,
    OverlayModule,
    HomeRoutingModule,
  ],
})
export class HomeModule {}
