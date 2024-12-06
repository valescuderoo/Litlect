import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; 
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service'; 
import { Reflection } from 'src/app/models/reflection.model';
import { ToastController, ModalController } from '@ionic/angular';
import { ReflectionModalComponent } from 'src/app/shared/components/reflection-modal/reflection-modal.component';



@Component({
  selector: 'app-reflection-details',
  templateUrl: './reflection-details-page.page.html',
  styleUrls: ['./reflection-details-page.page.scss'],
})
export class ReflectionDetailsPage implements OnInit {

  utilsSvc = inject(UtilsService);
  productId: string;
  currentUserName: string = ''; // Variable para almacenar el nombre del usuario actual
  reflections: any[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  bookTitle: string = ''; // Título del libro
  products: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private firebaseSvc: FirebaseService,
    private toastController: ToastController,
    private modalController: ModalController
  ) {}
  
  async ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('productId');
    const userId = this.firebaseSvc.getAuth().currentUser?.uid;
  
    if (this.productId) {
      try {
        // Obtener reflexiones de todos los usuarios
        const reflections = await this.firebaseSvc.getReflectionsFromAllUsers(this.productId);
        console.log('Reflexiones cargadas:', reflections); // Verifica si las reflexiones se cargan correctamente
  
        // Procesar reflexiones y obtener el nombre del usuario
        this.reflections = await Promise.all(
          reflections.map(async (reflection: Reflection) => {
            console.log('Procesando reflexión:', reflection); // Verifica si el userId está presente
            const userProfile = await this.firebaseSvc.getUserProfile(reflection.userId);
            return {
              ...reflection,
              userName: userProfile?.name || 'Nombre no disponible'
            };
          })
        );
  
        // Si no tenemos un título aún, intentamos obtenerlo de la primera reflexión
        if (this.reflections.length > 0) {
          const firstReflectionUserId = this.reflections[0].userId;
          const product = await this.firebaseSvc.getBookById(firstReflectionUserId, this.productId);
          this.bookTitle = product?.title || 'Título no disponible';
        }
      } catch (error) {
        console.error('Error al cargar reflexiones:', error);
        this.errorMessage = 'No se pudieron cargar las reflexiones. Intente más tarde.';
      } finally {
        this.loading = false;
      }
    } else {
      this.errorMessage = 'ID de producto no válido.';
      this.loading = false;
    }
    
  }
  async addReflection(productId: string, reflectionText: string, index: number) {
    const userId = this.firebaseSvc.getAuth().currentUser?.uid;

    if (!userId) {
      this.presentToast('Usuario no autenticado');
      return;
    }

    try {
      if (reflectionText) {
        await this.firebaseSvc.addReflection(userId, productId, reflectionText);
        this.products[index].reflections.push({
          userId,
          text: reflectionText,
          createdAt: new Date()
        });
        this.presentToast('Reflexión agregada con éxito');
      } else {
        this.presentToast('Por favor, escribe una reflexión antes de enviar');
      }
    } catch (error) {
      console.error('Error al agregar reflexión:', error);
      this.presentToast('Error al agregar reflexión, intenta nuevamente');
    }
  }

  async openReflectionModal(productId: string, index: number) {
    const userId = this.firebaseSvc.getAuth().currentUser?.uid;
  
    if (!userId) {
      this.presentToast('Debes estar autenticado para agregar una reflexión');
      return;
    }
  
    const modal = await this.modalController.create({
      component: ReflectionModalComponent,
      componentProps: { productId },
    });
  
    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        await this.addReflection(productId, result.data, index);
      }
    });
  
    await modal.present();
  }
  
    // Método presentToast para mostrar un mensaje de retroalimentación
    async presentToast(message: string) {
      const toast = await this.toastController.create({
        message,
        duration: 2000, // Duración en milisegundos
        position: 'bottom'
      });
      await toast.present();
    }
} 