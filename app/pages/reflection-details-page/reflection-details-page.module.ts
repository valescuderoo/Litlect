import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReflectionDetailsPagePageRoutingModule } from './reflection-details-page-routing.module';
import { ReflectionDetailsPage } from './reflection-details-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReflectionDetailsPagePageRoutingModule
  ],
  declarations: [ReflectionDetailsPage]
})
export class ReflectionDetailsPageModule {}
