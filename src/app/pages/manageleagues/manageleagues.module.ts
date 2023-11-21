import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageleaguesPageRoutingModule } from './manageleagues-routing.module';

import { ManageleaguesPage } from './manageleagues.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageleaguesPageRoutingModule
  ],
  declarations: [ManageleaguesPage]
})
export class ManageleaguesPageModule {}
