import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewleaguePage } from './newleague.page';

const routes: Routes = [
  {
    path: '',
    component: NewleaguePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewleaguePageRoutingModule {}
