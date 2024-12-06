import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReflexionesPageRoutingModule } from './reflexiones-routing.module';

import { ReflexionesPage } from './reflexiones.page';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReflexionesPageRoutingModule,
    SharedModule
  ],
  declarations: [ReflexionesPage]
})
export class ReflexionesPageModule {}

