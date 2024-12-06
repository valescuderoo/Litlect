import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  private firebaseSvc = inject(FirebaseService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const user = localStorage.getItem('user');

    // Si no hay usuario en el almacenamiento local, redirige al login
    if (!user) {
      return this.router.createUrlTree(['/auth']);
    }

    // Parseamos el usuario y verificamos si es admin
    const currentUser = JSON.parse(user);

    return new Promise((resolve) => {
      this.firebaseSvc.getAuth().onAuthStateChanged(async (auth) => {
        if (auth) {
          const isAdmin = await this.firebaseSvc.isAdmin();
          if (isAdmin && currentUser.role === 'admin') {
            resolve(true);  // Permite el acceso si es admin
          } else {
            resolve(this.router.createUrlTree(['/main/home']));  // Redirige al home si no es admin
          }
        } else {
          resolve(this.router.createUrlTree(['/auth']));  // Redirige al login si no está autenticado
        }
      });
    });
  }
}
