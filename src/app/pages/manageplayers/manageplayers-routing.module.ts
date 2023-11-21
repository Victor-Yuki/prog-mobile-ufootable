import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageplayersPage } from './manageplayers.page';

const routes: Routes = [
  {
    path: '',
    component: ManageplayersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageplayersPageRoutingModule {}
