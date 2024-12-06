import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PurposePageRoutingModule } from './purpose-routing.module';

import { PurposePage } from './purpose.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PurposePageRoutingModule
  ],
  declarations: [PurposePage]
})
export class PurposePageModule {}
