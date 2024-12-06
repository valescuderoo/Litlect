import { Component, inject, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
    // Actualiza el usuario cuando se recargue el componente
    const user = this.user();
    console.log(user);  // Verifica si el valor está actualizado
  }

  // Obtener el usuario desde el almacenamiento local
  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  async updateUserField(field: string, newValue: string) {
    let user = this.user();
    let path = `users/${user.uid}`;
  
    // Verificar que el uid esté disponible
    if (!user || !user.uid) {
      console.error("No se encontró el usuario o UID");
      return;
    }
  
    // Verificar si el campo es el correcto
    console.log(`Actualizando ${field} a ${newValue} en la ruta ${path}`);
  
    // Actualizar el campo en el objeto usuario
    user = { ...user, [field]: newValue };
  
    const loading = await this.utilsSvc.loading();
    await loading.present();
  
    this.firebaseSvc.updateDocument(path, { [field]: newValue })
      .then(async () => {
        // Actualizar el usuario en el almacenamiento local
        this.utilsSvc.saveInlocalStorage('user', user);
  
        this.utilsSvc.presentToast({
          message: `${field} actualizado exitosamente`,
          duration: 500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
      })
      .catch(error => {
        console.error("Error al actualizar el campo:", error);
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
      })
      .finally(() => {
        loading.dismiss();
      });
  }
  
  // Método existente para tomar imagen
  async takeImage() {
    let user = this.user();
    let path = `users/${user.uid}`;

    const dataUrl = (await this.utilsSvc.takePicture('Imagen del Perfil')).dataUrl;
    const loading = await this.utilsSvc.loading();
    await loading.present();

    let imagePath = `${user.uid}/profile`;
    user.image = await this.firebaseSvc.uploadImagen(imagePath, dataUrl);
    
    this.firebaseSvc.updateDocument(path, { image: user.image }).then(async () => {
      this.utilsSvc.saveInlocalStorage('user', user);

      this.utilsSvc.presentToast({
        message: 'Imagen actualizada exitosamente',
        duration: 500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      });
    }).catch(error => {
      console.log(error);

      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    }).finally(() => {
      loading.dismiss();
    });
  }
}
