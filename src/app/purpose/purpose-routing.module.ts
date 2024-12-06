import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PurposePage } from './purpose.page';

const routes: Routes = [
  {
    path: '',
    component: PurposePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurposePageRoutingModule {}
