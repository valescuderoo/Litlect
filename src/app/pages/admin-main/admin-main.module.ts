import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminMainPageRoutingModule } from './admin-main-routing.module';

import { AdminMainPage } from './admin-main.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminMainPageRoutingModule,
    SharedModule
  ],
  declarations: [AdminMainPage]
})
export class AdminMainPageModule {}
