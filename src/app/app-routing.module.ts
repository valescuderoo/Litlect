import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NoAuthGuard } from './guards/no-auth.guard';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';


const routes: Routes = [

  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then( m => m.AuthPageModule),canActivate:[NoAuthGuard]
  },
  {
    path: 'main',
    loadChildren: () => import('./pages/main/main.module').then( m => m.MainPageModule)
  },
  {
    path: 'admin-main',
    loadChildren: () => import('./pages/admin-main/admin-main.module').then( m => m.AdminMainPageModule), canActivate:[AdminGuard]
  },
  {
    path: 'reflection-details-page/:productId',
    loadChildren: () => import('./pages/reflection-details-page/reflection-details-page.module').then(m => m.ReflectionDetailsPageModule)
  },
  {
    path: 'products2',
    loadChildren: () => import('./pages/products2/products2.module').then( m => m.  Products2PageModule), canActivate:[NoAuthGuard]
  },

  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then( m => m.InicioPageModule), canActivate:[NoAuthGuard]
  },
  {
    path: 'auth/sign-up',
    loadChildren: () => import('./pages/auth/sign-up/sign-up.module').then(m => m.SignUpPageModule)  // Ruta de sign-up dentro de auth
  },
  {
    path: 'purpose',
    loadChildren: () => import('./purpose/purpose.module').then( m => m.PurposePageModule)
  },


  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
