import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { OverlayModule } from '@angular/cdk/overlay';
import { HomeRoutingModule } from './home-routing.module';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { HomeComponent } from './home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskAddComponent } from './pages/task-add/task-add.component';

@NgModule({
  declarations: [
    HomeComponent,
    NavBarComponent,
    DashboardComponent,
    TaskAddComponent,
  ],
  imports: [
    CommonModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    OverlayModule,
    HomeRoutingModule,
  ],
})
export class HomeModule {}
