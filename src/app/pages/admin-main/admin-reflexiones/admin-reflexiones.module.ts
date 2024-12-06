import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminReflexionesPageRoutingModule } from './admin-reflexiones-routing.module';

import { AdminReflexionesPage } from './admin-reflexiones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminReflexionesPageRoutingModule
  ],
  declarations: [AdminReflexionesPage]
})
export class AdminReflexionesPageModule {}
