import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent  implements OnInit {

  @Input() product: Product;

  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', [Validators.required,]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    autor: new FormControl('', [Validators.required, Validators.minLength(6)]),
    descripcion: new FormControl('', [Validators.required, Validators.minLength(20)]),
    categoria: new FormControl('', [Validators.required,])
  })

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  user = {} as User;


  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
    if (this.product) this.form.setValue(this.product);
  }
  
// IMG
async takeImage() {
  const dataUrl = (await this.utilsSvc.takePicture('Imagen del Producto')).dataUrl;
  this.form.controls.image.setValue(dataUrl);
}

submit(){
  if (this.form.valid) {
   if (this.product) this.updateProduct();
   else this.createProduct()
  }

}





//********* Crear Producto/Subir Portada */
  async createProduct() {
   

      let path = `users/${this.user.uid}/products`

      const loading = await this.utilsSvc.loading();
      await loading.present();

      // SUBIR LA IMG Y OBTENER LA URL
      let dataUrl = this.form.value.image;
      let imagePath = `${this.user.uid}/${Date.now()}`;
      let imageUrl = await this.firebaseSvc.uploadImagen(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);

      delete this.form.value.id

      this.firebaseSvc.addDocument(path, this.form.value).then(async res => {


        this.utilsSvc.dismissModal({ succes: true });
        this.utilsSvc.presentToast({
          message: 'creado',
          duration: 500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        })



      }).catch(error => {
        console.log(error);

        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline',
        })

      }).finally(() => {
        loading.dismiss();
      })
  }

  //********* Actualizar Producto/Actualizar Portada */
  async updateProduct() {

      let path = `users/${this.user.uid}/products/${this.product.id}`
 
      const loading = await this.utilsSvc.loading();
      await loading.present();

      // Si cambio la imagen,subir la nueva y obtener la url
      if(this.form.value.image !== this.product.image){
        let dataUrl = this.form.value.image;
        let imagePath = await this.firebaseSvc.getfilePath(this.product.image);
        let imageUrl = await this.firebaseSvc.uploadImagen(imagePath, dataUrl);
        this.form.controls.image.setValue(imageUrl);

      }
      
      delete this.form.value.id

      this.firebaseSvc.updateDocument(path, this.form.value).then(async res => {


        this.utilsSvc.dismissModal({ succes: true });
        this.utilsSvc.presentToast({
          message: 'Portada actualizada exitosamente',
          duration: 500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        })



      }).catch(error => {
        console.log(error);

        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline',
        })

      }).finally(() => {
        loading.dismiss();
      })
  }
}
