import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-reflexiones',
  templateUrl: './reflexiones.page.html',
  styleUrls: ['./reflexiones.page.scss'],
})
export class ReflexionesPage implements OnInit {
  reflections: any[] = [];  // Almacena todas las reflexiones
  loading: boolean = true;
  

  constructor(
    private firebaseSvc: FirebaseService,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    this.loading = true;
    const userId = this.firebaseSvc.getAuth().currentUser?.uid;

    if (!userId) {
      this.presentToast('Usuario no autenticado');
      this.loading = false;
      return;
    }

    try {
      // Obtener todas las reflexiones de los productos del usuario actual
      this.reflections = await this.firebaseSvc.getReflectionsFromAllProducts(userId);
      // Agregar el nombre del producto a cada reflexión
      for (let reflection of this.reflections) {
        const productData = await this.firebaseSvc.getBookById(userId, reflection.productId);
        reflection.productName = productData?.name || 'Título no disponible';
      }
    } catch (error) {
      console.error('Error al cargar las reflexiones:', error);
      this.presentToast('Error al cargar las reflexiones. Intenta nuevamente.');
    } finally {
      this.loading = false;
    }
  }

  // Función para eliminar una reflexión
  async deleteReflection(reflection: any) {
    const userId = this.firebaseSvc.getAuth().currentUser?.uid;
    if (userId) {
      try {
        // Llamar al servicio para eliminar la reflexión
        await this.firebaseSvc.deleteReflection(userId, reflection.productId, reflection.id);
        this.presentToast('Reflexión eliminada exitosamente.');
        
        // Eliminar la reflexión del array local
        this.reflections = this.reflections.filter(r => r.id !== reflection.id);
      } catch (error) {
        console.error('Error al eliminar la reflexión:', error);
        this.presentToast('Error al eliminar la reflexión. Intenta nuevamente.');
      }
    } else {
      this.presentToast('Usuario no autenticado.');
    }
  }

  // Método para mostrar un mensaje de Toast
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
  
}
