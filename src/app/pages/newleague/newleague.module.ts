import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewleaguePageRoutingModule } from './newleague-routing.module';

import { NewleaguePage } from './newleague.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewleaguePageRoutingModule
  ],
  declarations: [NewleaguePage]
})
export class NewleaguePageModule {}
