import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';  // Asegúrate de importar tu servicio de autenticación

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage {

  constructor(
    private navCtrl: NavController,
    private firebaseSvc: FirebaseService  // Servicio de autenticación
  ) {}

  // Método para redirigir al usuario a la página de productos
  viewProducts() {
    const user = this.firebaseSvc.getAuth().currentUser;

    if (user) {
      // Si el usuario está autenticado, redirigir a la página de productos
      this.navCtrl.navigateForward('products2');
    } else {
      // Si no está autenticado, también redirigir a los productos pero sin permisos completos
      this.navCtrl.navigateForward('productos2');
    }
  }
}
