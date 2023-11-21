import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageplayersPageRoutingModule } from './manageplayers-routing.module';

import { ManageplayersPage } from './manageplayers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageplayersPageRoutingModule
  ],
  declarations: [ManageplayersPage]
})
export class ManageplayersPageModule {}
