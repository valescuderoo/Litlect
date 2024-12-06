import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';
import { AlertController, ModalController, NavController, ToastController } from '@ionic/angular'; // Importa AlertController

@Component({
  selector: 'app-products2',
  templateUrl: './products2.page.html',
  styleUrls: ['./products2.page.scss'],
})
export class Products2Page implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  searchText: string = '';
  loading: boolean = true;
  selectedCategory: string = '';
  categories: string[] = ['Romance/Drama', 'Ciencia/Ficcion', 'Misterio/Thriller', 'Poesia', 'Fantasia', 'Historia'];
  showSearchBar: boolean = false; // Controla la visibilidad de la barra de búsqueda
  showCategoryFilter: boolean = false; // Controla la visibilidad del filtro de categorías

  constructor(
    private firebaseSvc: FirebaseService,
    private router: Router,
    private alertController: AlertController, // Inyecta AlertController
    private modalController: ModalController,
    private navCtrl: NavController,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    this.loading = true;
    try {
      this.products = await this.firebaseSvc.getAllProducts();
      console.log('Productos cargados:', this.products.length);
      this.filteredProducts = this.products;
    } catch (error) {
      console.error('Error al cargar productos:', error);
      // Opcional: Muestra un mensaje al usuario
      this.toastController.create({
        message: 'No se pudieron cargar los productos.',
        duration: 3000,
        color: 'danger',
      }).then(toast => toast.present());
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

  /**
   * Filtrar productos según la categoría seleccionada y el texto de búsqueda.
   */
  filterProducts() {
    let filtered = this.products;

    // Filtrar por categoría si hay una seleccionada
    if (this.selectedCategory) {
      filtered = filtered.filter(product => product.categoria === this.selectedCategory);
    }

    // Filtrar por texto de búsqueda si no está vacío
    if (this.searchText.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    this.filteredProducts = filtered;
  }

  /**
   * Limpiar el filtro de categorías.
   */
  clearFilter() {
    this.selectedCategory = '';
    this.filterProducts();
  }

  /**
   * Buscar productos con el texto ingresado.
   */
  searchProducts() {
    this.filterProducts();
  }

  /**
   * Mostrar reflexiones con una alerta y opciones de registro/inicio de sesión.
   */
  async verReflexiones() {
    const alert = await this.alertController.create({
      header: 'Inspiración Diaria',
      message: 'Descubre reflexiones inspiradoras que enriquecerán tu vida. Para acceder, regístrate o inicia sesión.',
      buttons: [
        {
          text: 'Registrarse',
          handler: () => {
            this.router.navigate(['/auth/sign-up']); // Redirige a la página de registro
          }
        },
        {
          text: 'Iniciar Sesión',
          handler: () => {
            this.router.navigate(['/auth']); // Redirige a la página de inicio de sesión
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }
}
