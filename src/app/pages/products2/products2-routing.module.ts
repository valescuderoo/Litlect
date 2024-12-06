import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Products2Page } from './products2.page';

const routes: Routes = [
  {
    path: '',
    component: Products2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Products2PageRoutingModule {}
