import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { MenuController } from '@ionic/angular'; // Importa MenuController

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  pages = [
    { title: 'Mis Libros', url: '/main/home', icon: 'home-outline' },
    { title: 'Mi Perfil', url: '/main/profile', icon: 'person-outline' },
    { title: 'Libros', url: '/main/products', icon: 'book-outline' },
    { title: 'Reflexiones', url: '/main/reflexiones', icon: 'chatbubbles-outline' },
  ];

  rowter = inject(Router);
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  menuController = inject(MenuController); // Inyecta el controlador de menú

  currentPath: string = '';
 

  ngOnInit() {
    // Suscribirse a las rutas para actualizar la ruta actual
    this.rowter.events.subscribe((event: any) => {
      if(event?.url) this.currentPath = event.url;
    });

  }


  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  signOut() {
    this.firebaseSvc.signOut();
  }


}
