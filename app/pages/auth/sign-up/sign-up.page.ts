import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  // Definición del formulario con validaciones
  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    role: new FormControl('')  // Campo `role` para identificar roles de usuario
  });

  // Inyección de servicios
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {}

  // Método de envío del formulario de registro
  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();
  
      // Asigna el rol en base al email antes de llamar a signUp
      const role = this.form.value.email === 'admin@admin.cl' ? 'admin' : 'user';
      this.form.controls.role.setValue(role);
  
      try {
        // Registro del usuario en Firebase
        const res = await this.firebaseSvc.signUp(this.form.value as User);
        
        // Actualizar el nombre de usuario en Firebase
        await this.firebaseSvc.updateUser(this.form.value.name);
        
        // Establecer el uid y almacenar los datos del usuario en Firestore
        const uid = res.user.uid;
        this.form.controls.uid.setValue(uid);
        await this.setUserInfo(uid, role);
  
      } catch (error) {
        console.error('Error en el registro:', error);
        this.utilsSvc.presentToast({
          message: error.message || 'Error en el registro',
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
      } finally {
        loading.dismiss();
      }
    }
  }
  
  async setUserInfo(uid: string, role: string) {
    const loading = await this.utilsSvc.loading();
    await loading.present();
  
    const path = `users/${uid}`;
  
    // Crear una copia de los datos sin el campo password
    const userData = { ...this.form.value };
    delete userData.password;
  
    try {
      // Guardar el documento del usuario en Firestore
      await this.firebaseSvc.setDocument(path, userData);
  
      // Guardar la información del usuario en almacenamiento local
      this.utilsSvc.saveInlocalStorage('user', userData);
  
      // Redirigir al usuario dependiendo de su rol
      if (role === 'admin') {
        this.utilsSvc.routerLink('/admin-main/admin-products');  // Redirige al admin a la página de productos
      } else {
        this.utilsSvc.routerLink('/main/home');  // Redirige a la página principal para usuarios regulares
      }
  
      // Resetear el formulario después de completar el registro
      this.form.reset();
  
    } catch (error) {
      console.error('Error al guardar la información del usuario:', error);
      this.utilsSvc.presentToast({
        message: error.message || 'Error al guardar la información',
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    } finally {
      loading.dismiss();
    }
  }
}  