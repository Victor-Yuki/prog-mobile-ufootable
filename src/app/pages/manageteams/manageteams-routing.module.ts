import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageteamsPage } from './manageteams.page';

const routes: Routes = [
  {
    path: '',
    component: ManageteamsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageteamsPageRoutingModule {}
