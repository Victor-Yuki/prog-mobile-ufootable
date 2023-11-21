import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'home',
  //   pathMatch: 'full'
  // },
  {
    path: 'newleague/:id',
    loadChildren: () => import('./pages/newleague/newleague.module').then( m => m.NewleaguePageModule)
  },
  {
    path: '',
    pathMatch:'full',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'manageleagues/:id',
    loadChildren: () => import('./pages/manageleagues/manageleagues.module').then( m => m.ManageleaguesPageModule)
  },
  {
    path: 'manageteams/:id',
    loadChildren: () => import('./pages/manageteams/manageteams.module').then( m => m.ManageteamsPageModule)
  },
  {
    path: 'manageplayers/:id',
    loadChildren: () => import('./pages/manageplayers/manageplayers.module').then( m => m.ManageplayersPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
