import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'users',
        loadChildren: () => import('./users/users.module')
          .then(m => m.UsersModule),
      },
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full',
      },
      {
      path: '**',
      redirectTo: 'users',
      pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
