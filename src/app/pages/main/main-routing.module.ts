import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoAuthGuard } from 'src/app/guards/no-auth.guard';
import { AuthGuard } from 'src/app/guards/auth.guard'; 


import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomePageModule), canActivate: [AuthGuard]
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule), 
      },
      {
        path: 'reflexiones',
        loadChildren: () => import('./reflexiones/reflexiones.module').then( m => m.ReflexionesPageModule), canActivate: [AuthGuard]
      },
      {
        path: 'products/:productId',
        loadChildren: () => import('./products/products.module').then(m => m.ProductsPageModule), canActivate: [AuthGuard]
      },
      {
        path: 'products', // Ruta sin parámetro
        loadChildren: () => import('./products/products.module').then(m => m.ProductsPageModule), canActivate: [AuthGuard]
      },
      
    ]
  },


  




];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule { }
