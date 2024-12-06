import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminMainPage } from './admin-main.page';

const routes: Routes = [
  {
    path: '',
    component: AdminMainPage,
    children: [

      {
        path: 'admin-products',
        loadChildren: () => import('./admin-products/admin-products.module').then(m => m.AdminProductsPageModule)
      },
      {
        path: 'admin-reflexiones/:productId',
        loadChildren: () => import('./admin-reflexiones/admin-reflexiones.module').then(m => m.AdminReflexionesPageModule)

      },

]

}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminMainPageRoutingModule { }
