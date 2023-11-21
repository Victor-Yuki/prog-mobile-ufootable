import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageleaguesPage } from './manageleagues.page';

const routes: Routes = [
  {
    path: '',
    component: ManageleaguesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageleaguesPageRoutingModule {}
