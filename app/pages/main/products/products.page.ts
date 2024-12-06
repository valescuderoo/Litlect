import { Component, inject, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ToastController, ModalController } from '@ionic/angular';
import { ReflectionModalComponent } from 'src/app/shared/components/reflection-modal/reflection-modal.component'; 
import { NavController } from '@ionic/angular';



@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  


  products: any[] = [];
  filteredProducts: any[] = [];
  reflections: string[] = [];
  showReflections: boolean[] = [];
  loading: boolean = true;
  selectedCategory: string = '';
  searchText: string = '';
  categories: string[] = ['Romance/Drama', 'Ciencia/Ficcion', 'Misterio/Thriller', 'Poesia', 'Fantasia', 'Historia'];
  showSearchBar: boolean = false;
  showCategoryFilter: boolean = false; // Variable para controlar la visibilidad del filtro de categorías

  constructor(
    public firebaseSvc: FirebaseService,
    private toastController: ToastController,
    private modalController: ModalController,
    private navCtrl: NavController
    
  ) {}

  async ngOnInit() {
    this.loading = true;

    try {
      this.products = await this.firebaseSvc.getAllProducts();
      this.filteredProducts = [...this.products];

      await Promise.all(
        this.products.map(async (product, index) => {
          product.reflections = await this.firebaseSvc.getReflectionsFromAllUsers(product.id);
          this.showReflections[index] = false;
        })
      );
    } catch (error) {
      console.error('Error al cargar los productos o reflexiones:', error);
      this.presentToast('Error al cargar los productos. Intenta nuevamente.');
    } finally {
      this.loading = false;
    }
  }

  /**
   * Alternar la visibilidad de la barra de búsqueda.
   * Si la barra de búsqueda se muestra, cierra el filtro de categorías.
   */
  toggleSearchBar() {
    this.showSearchBar = !this.showSearchBar;

    // Si se abre la barra de búsqueda, cierra el filtro de categorías
    if (this.showSearchBar) {
      this.showCategoryFilter = false;
    }

    // Si se cierra la barra de búsqueda, resetea el texto y filtra
    if (!this.showSearchBar) {
      this.searchText = '';
      this.filterProducts();
    }
  }

  /**
   * Alternar la visibilidad del filtro de categorías.
   * Si el filtro se muestra, cierra la barra de búsqueda.
   */
  toggleCategoryFilter() {
    this.showCategoryFilter = !this.showCategoryFilter;

    // Si se abre el filtro de categorías, cierra la barra de búsqueda
    if (this.showCategoryFilter) {
      this.showSearchBar = false;
    }

    // Si se cierra el filtro de categorías, limpia la selección y filtra
    if (!this.showCategoryFilter) {
      this.selectedCategory = '';
      this.filterProducts();
    }
  }

  filterProducts() {
    let filtered = this.products;
    
    if (this.selectedCategory) {
      filtered = filtered.filter(product => product.categoria === this.selectedCategory);
    }

    if (this.searchText.trim()) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    this.filteredProducts = filtered;
  }

  clearFilter() {
    this.selectedCategory = '';
    this.filterProducts();
  }

  searchProducts() {
    this.filterProducts();
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

    return await modal.present();
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

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  goToReflectionDetails(productId: string) {
    this.navCtrl.navigateForward(`/reflection-details-page/${productId}`);
  }
}
