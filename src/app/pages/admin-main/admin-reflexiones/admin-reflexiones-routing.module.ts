import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminReflexionesPage } from './admin-reflexiones.page';

const routes: Routes = [
  {
    path: '',
    component: AdminReflexionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminReflexionesPageRoutingModule {}
