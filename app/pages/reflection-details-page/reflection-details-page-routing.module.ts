import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReflectionDetailsPage } from './reflection-details-page.page'; 

const routes: Routes = [
  {
    path: '',
    component: ReflectionDetailsPage }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReflectionDetailsPagePageRoutingModule {}
