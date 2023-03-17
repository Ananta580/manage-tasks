import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SettingComponent } from './pages/setting/setting.component';
import { TaskAddComponent } from './pages/task-add/task-add.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'task/:id',
        component: TaskAddComponent,
      },
      {
        path: 'task',
        component: TaskAddComponent,
      },
      {
        path: 'setting',
        component: SettingComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
