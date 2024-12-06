import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Products2PageRoutingModule } from './products2-routing.module';

import { Products2Page } from './products2.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Products2PageRoutingModule,
    SharedModule
  ],
  declarations: [Products2Page]
})
export class Products2PageModule {}
