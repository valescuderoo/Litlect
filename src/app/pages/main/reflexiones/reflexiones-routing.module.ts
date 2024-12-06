import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReflexionesPage } from './reflexiones.page';

const routes: Routes = [
  {
    path: '',
    component: ReflexionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReflexionesPageRoutingModule {}
