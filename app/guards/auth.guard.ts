import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  router = inject(Router);  // Inyectamos el Router para redirecciones

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let user = localStorage.getItem('user');

    // Si el usuario no está autenticado, lo redirigimos al login
    if (!user) {
      return this.router.createUrlTree(['/auth']);  // Redirige a la página de login
    }

    // Si está autenticado, verificamos el rol del usuario
    return new Promise((resolve) => {
      const currentUser = JSON.parse(user);  // Parseamos el usuario desde el almacenamiento local
      this.firebaseSvc.getAuth().onAuthStateChanged((auth) => {
        if (auth) {
          // Verificamos el rol del usuario
          if (currentUser.role === 'admin') {
            // Si es admin, permite el acceso solo a las rutas de administración
            const isAdminRoute = state.url.includes('/admin');
            if (isAdminRoute) {
              resolve(true);  // Permite el acceso a rutas de admin
            } else {
              resolve(this.router.createUrlTree(['/admin-main/admin-products']));  // Redirige al panel de administración
            }
          } else {
            // Si no es admin, permite el acceso a las rutas normales
            const isAdminRoute = state.url.includes('/admin');
            if (isAdminRoute) {
              resolve(this.router.createUrlTree(['/main/home']));  // Redirige al home si es usuario normal
            } else {
              resolve(true);  // Permite el acceso a rutas normales
            }
          }
        } else {
          // Si no está autenticado, redirige a la página de login
          resolve(this.router.createUrlTree(['/auth']));
        }
      });
    });
  }
}
