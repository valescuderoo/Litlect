import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { MenuController } from '@ionic/angular'; // Importa MenuController 

@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.page.html',
  styleUrls: ['./admin-main.page.scss'],
})
export class AdminMainPage implements OnInit {

  pages = [
    

  ];

  rowter = inject(Router);
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  menuController = inject(MenuController); // Inyecta el controlador de menú

  currentPath: string = '';
  isAdmin: boolean = false;  // Variable para almacenar el estado de admin

  ngOnInit() {
    // Suscribirse a las rutas para actualizar la ruta actual
    this.rowter.events.subscribe((event: any) => {
      if(event?.url) this.currentPath = event.url;
    });

    // Comprobar si el usuario es admin
    this.checkAdminStatus();
  }

  async checkAdminStatus() {
    const user = this.utilsSvc.getFromLocalStorage('user');
    this.isAdmin = user?.role === 'admin';

    if (this.isAdmin) {
      
    }
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  signOut() {
    this.firebaseSvc.signOut();
  }

  async goToAdminPanel() {
    await this.menuController.close(); // Cierra el menú
    this.rowter.navigate(['/admin-main/admin-products']); // Redirige al panel de administración
  }
}
