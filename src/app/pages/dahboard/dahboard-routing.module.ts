import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { CanDeactivateGuard } from 'src/app/core/guards/can-deactivate.guard';

import { DahboardPage } from './dahboard.page';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: DahboardPage,
    children: [
      {
        path: '',
        redirectTo: 'feeds',
        pathMatch: 'full'
      },
      {
        path: 'feeds',
        loadChildren: () => import('../feeds/feeds.module').then(m => m.FeedsPageModule)
      },

      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule)
      }
    ]
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    CanDeactivateGuard
  ]
})
export class DahboardPageRoutingModule { }
