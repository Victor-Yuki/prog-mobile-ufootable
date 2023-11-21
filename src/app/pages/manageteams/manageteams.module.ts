import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageteamsPageRoutingModule } from './manageteams-routing.module';

import { ManageteamsPage } from './manageteams.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageteamsPageRoutingModule
  ],
  declarations: [ManageteamsPage]
})
export class ManageteamsPageModule {}
