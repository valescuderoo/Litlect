import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, collectionData, query, updateDoc, deleteDoc, getDocs, where } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL, deleteObject} from "firebase/storage";
import { Observable } from 'rxjs';
import { Reflection } from 'src/app/models/reflection.model';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  storage = inject(AngularFireStorage);
  utilsSvc = inject(UtilsService);


  //autenticación
  getAuth(){
    return getAuth();

  }


  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password)
      .then(async (res) => {
        const uid = res.user.uid;
        const userProfile = await this.getUserProfile(uid); // Obtener el perfil del usuario desde Firestore
  
        // Verificar el rol del usuario
        if (userProfile?.role === 'admin') {
          // Si el usuario es admin, redirigir a la página de administración
          this.utilsSvc.routerLink('admin-products');
        } else {
          // Si el usuario no es admin, redirigir a la página principal
          this.utilsSvc.routerLink('main/home');
        }
  
        return res;
      })
      .catch(error => {
        console.error('Error al iniciar sesión', error);
        throw error;
      });
  }
  

  //crear usuario
  async signUp(user: User) {
    const authUser = await createUserWithEmailAndPassword(getAuth(), user.email, user.password);
    
    // Asigna el rol basado en el correo
    const role = user.email === 'admin1@admin.cl' ? 'admin' : 'user';
  
    // Guarda el usuario en Firestore con el rol asignado
    const userData = {
      uid: authUser.user.uid,
      email: user.email,
      name: user.name,
      role: role  // Asigna el rol
    };
    await this.setDocument(`users/${authUser.user.uid}`, userData);
  
    return authUser;
  }
  async isAdmin(): Promise<boolean> {
    const user = getAuth().currentUser;
    if (!user) return false; // Si no hay usuario autenticado, no es admin
  
    try {
      const userProfile = await this.getUserProfile(user.uid);
      return userProfile?.role === 'admin';
    } catch (error) {
      console.error('Error al obtener el perfil del usuario', error);
      return false; // Si ocurre un error, no se considera admin
    }
  }
  
    


  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  //restablecer contraseña
  sendRecoveryEmail(email: string ){
    return sendPasswordResetEmail(getAuth(), email);
  }

  async signOut() {
    try {
      // Esperar a que el cierre de sesión se complete
      await getAuth().signOut();
  
      // Eliminar el usuario del localStorage
      localStorage.removeItem('user');
  
      // Redirigir al usuario a la página de inicio
      this.utilsSvc.routerLink('/inicio');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Manejo de error opcional, por ejemplo, mostrar un mensaje al usuario
      this.utilsSvc.presentToast({ message: 'Error al cerrar sesión. Inténtalo nuevamente.', duration: 3000 });
    }
  }
  


  // *************************** base de datos ******************

  // ****** Obtener los documentos de una colección ********
  getCollectionData(path: string, collectionQuery?: any){
    const ref = collection(getFirestore(),path);
    return collectionData(query(ref, collectionQuery), {idField: 'id'});

  }

  //setear el documento crea si no esta y modifica si está
  setDocument(path: string, data: any){
    return setDoc(doc(getFirestore(),path), data);
  }

   //Actualizar documento
   updateDocument(path: string, data: any){
    return updateDoc(doc(getFirestore(),path), data);
  }

  
   //eliminar  documento
   deleteDocument(path: string){
    return deleteDoc(doc(getFirestore(),path));
  }


  //obtener  el documento
async  getDocument(path: string){
    return (await getDoc(doc(getFirestore(),path))).data();
  }

  // agregar documento
  addDocument(path: string, data: any){
    return addDoc(collection(getFirestore(),path), data);
  }

  // ALMACENAMIENTO

  //subir imagen
  
  async uploadImagen(path: string, data_url: string){
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() =>{
    return getDownloadURL(ref(getStorage(), path))
    })

  }
 
  //**Obtener imagen con su url */
  async getfilePath(url: string) {
    return ref(getStorage(), url).fullPath
  }

  //** Eliminar producto */
  deleteFile(path: string){
    return deleteObject(ref(getStorage(), path));

  }

// FirebaseService: función simplificada para obtener todos los productos
  
async getAllProducts(): Promise<any[]> {
  const firestore = getFirestore();
  const usersRef = collection(firestore, 'users');
  const products: any[] = [];

  try {
    const userSnapshots = await getDocs(usersRef);
    console.log('Usuarios encontrados:', userSnapshots.size);

    for (const userDoc of userSnapshots.docs) {
      const userId = userDoc.id;
      const productsRef = collection(firestore, `users/${userId}/products`);
      const productSnapshots = await getDocs(productsRef);

      console.log(`Productos del usuario ${userId}:`, productSnapshots.size);

      productSnapshots.forEach(productDoc => {
        products.push({
          id: productDoc.id,
          userId,
          ...productDoc.data(),
        });
      });
    }

    console.log('Total de productos:', products.length);
    return products;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
}






  // En el servicio FirebaseService

   // Función para agregar una reflexión a un producto específico
   // Agregar reflexión a un libro (producto)
   async addReflection(userId: string, productId: string, reflectionText: string) {
    const userProfile = await this.getUserProfile(userId); // Obtenemos el perfil del usuario
    const reflection = {
      userId: userId,          // ID del usuario que está agregando la reflexión
      displayName: userProfile?.displayName || 'Anónimo', // Agrega el nombre del usuario
      text: reflectionText,    // El texto de la reflexión
      createdAt: new Date()    // Fecha y hora actual de la reflexión
    };
  
    const reflectionsRef = collection(getFirestore(), `users/${userId}/products/${productId}/reflections`);
    await addDoc(reflectionsRef, reflection);  // Agregar la reflexión a la subcolección
    

  }
  // Obtener reflexiones de un libro (producto)
async getReflections(userId: string, productId: string): Promise<any[]> {
  const reflectionsRef = collection(getFirestore(), `users/${userId}/products/${productId}/reflections`);
  const reflectionsSnapshot = await getDocs(reflectionsRef);
  return reflectionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
 // ** Nueva función: Obtener reflexiones de todos los usuarios para un libro (producto)**
 async getReflectionsFromAllUsers(productId: string): Promise<any[]> {
  const reflections: any[] = [];

  try {
    // Obtener todos los usuarios
    const usersSnapshot = await getDocs(collection(getFirestore(), 'users'));

    // Recorrer cada usuario y obtener sus reflexiones
    for (const userDoc of usersSnapshot.docs) {
      const reflectionsRef = collection(getFirestore(), `users/${userDoc.id}/products/${productId}/reflections`);
      const reflectionsSnapshot = await getDocs(reflectionsRef);

      // Verifica si hay reflexiones, si no, agregar un log para depuración
      if (reflectionsSnapshot.empty) {
        console.log(`No hay reflexiones para el producto ${productId} de usuario ${userDoc.id}`);
      }

      // Agregar todas las reflexiones de este producto del usuario
      reflectionsSnapshot.forEach(doc => {
        reflections.push({ id: doc.id, userId: userDoc.id, ...doc.data() });
      });
    }
  } catch (error) {
    console.error('Error al obtener reflexiones:', error);
  }

  console.log('Total de reflexiones encontradas:', reflections.length);
  return reflections; // Regresar todas las reflexiones
}

 
  // Obtener reflexiones de todos los productos de un usuario
async getReflectionsFromAllProducts(userId: string): Promise<any[]> {
  const reflections: any[] = [];

  // Obtén todos los productos del usuario
  const productsSnapshot = await getDocs(collection(getFirestore(), `users/${userId}/products`));

  // Recorre todos los productos para obtener las reflexiones
  for (const productDoc of productsSnapshot.docs) {
    const productId = productDoc.id;
    const reflectionsRef = collection(getFirestore(), `users/${userId}/products/${productId}/reflections`);
    const reflectionsSnapshot = await getDocs(reflectionsRef);
    
    // Añade las reflexiones de cada producto al array
    reflectionsSnapshot.forEach(doc => {
      reflections.push({ id: doc.id, productId: productId, ...doc.data() });
    });
  }

  return reflections; // Devuelve todas las reflexiones de todos los productos del usuario
}
//obtiene el titulo del libro
// Obtiene los detalles del producto, incluido el título y la URL de la imagen
async getBookById(userId: string, productId: string): Promise<any> {
  const docRef = doc(getFirestore(), `users/${userId}/products/${productId}`);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const productData = docSnap.data();
    
    // Accede a las propiedades usando notación de corchetes
    return {
      title: productData['name'] || 'Sin título',
      imageUrl: productData['imageUrl'] || '', // Asegúrate de que `imageUrl` esté presente en los datos
      ...productData,
    };
  } else {
    return null;
  }
}


// Función para eliminar una reflexión
async deleteReflection(userId: string, productId: string, reflectionId: string) {
  const reflectionRef = doc(getFirestore(), `users/${userId}/products/${productId}/reflections/${reflectionId}`);
  await deleteDoc(reflectionRef); // Elimina la reflexión
}
async getUserProfile(userId: string): Promise<any> {
  try {
    const userDoc = await this.firestore.collection('users').doc(userId).get().toPromise();

    if (userDoc.exists) {
      console.log('Perfil del usuario:', userDoc.data());
      return userDoc.data();  // Aquí se incluye el rol
    } else {
      console.warn('No se encontró el perfil del usuario:', userId);
      return null;  // Si no existe el documento, retorna null
    }
  } catch (error) {
    console.error('Error al obtener el perfil del usuario', error);
    return null;  // En caso de error, retorna null
  }
}
  // Función para eliminar una reflexión
  async deleteReflection2(userId: string, productId: string, reflectionId: string) {
    try {
      const reflectionRef = doc(getFirestore(), `users/${userId}/products/${productId}/reflections/${reflectionId}`);
      console.log('Parámetros recibidos:', { userId, productId, reflectionId });  // Verifica los parámetros recibidos
      console.log('Referencia a eliminar:', reflectionRef);  // Verifica la referencia construida
      await deleteDoc(reflectionRef); // Elimina la reflexión
      console.log('Reflexión eliminada exitosamente');
    } catch (error) {
      console.error('Error al eliminar la reflexión:', error);
      throw new Error('No se pudo eliminar la reflexión');
    }
  }




// Obtener todos los productos incluyendo datos de los usuarios
async getAllProductsWithUserData(): Promise<any[]> {
  const products: any[] = [];
  try {
    const usersSnapshot = await getDocs(collection(getFirestore(), 'users'));
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data(); // Datos del usuario
      const productsSnapshot = await getDocs(collection(userDoc.ref, 'products'));

      productsSnapshot.forEach(productDoc => {
        products.push({
          id: productDoc.id,
          ...productDoc.data(),
          userId: userDoc.id, // Agregar ID del usuario al producto
          userName: userData['name'] || 'Anónimo', // Agregar nombre del usuario si está disponible
        });
      });
    }
  } catch (error) {
    console.error('Error al obtener todos los productos:', error);
  }
  return products;
}
// Eliminar producto dado el userId y el productId
async deleteProduct(userId: string, productId: string): Promise<void> {
  try {
    const productRef = doc(getFirestore(), `users/${userId}/products/${productId}`);
    await deleteDoc(productRef);
    console.log(`Producto ${productId} eliminado correctamente para el usuario ${userId}`);
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    throw error;
  }
}
async updateUserName(userId: string, newDisplayName: string) {
  try {
    // Actualiza el nombre de visualización en Firebase Authentication
    await updateProfile(getAuth().currentUser, { displayName: newDisplayName });

    // Luego actualiza el nombre en Firestore para el usuario específico
    const userRef = doc(getFirestore(), `users/${userId}`);
    await updateDoc(userRef, { name: newDisplayName });

    console.log('Nombre de usuario actualizado exitosamente');
  } catch (error) {
    console.error('Error al actualizar el nombre de usuario:', error);
    throw new Error('No se pudo actualizar el nombre de usuario');
  }
}
async getAllPublicProducts(): Promise<any[]> {
  const firestore = getFirestore(); // Obtenemos Firestore
  const usersRef = collection(firestore, 'users'); // Referencia a la colección 'users'
  const products: any[] = []; // Aquí almacenaremos los productos

  try {
    // Obtenemos todos los usuarios
    const userSnapshots = await getDocs(usersRef);
    for (const userDoc of userSnapshots.docs) {
      const userId = userDoc.id; // ID del usuario actual
      const productsRef = collection(firestore, `users/${userId}/products`); // Referencia a la subcolección 'products'
      const productSnapshots = await getDocs(productsRef);

      // Añadimos cada producto al array de productos
      productSnapshots.forEach(productDoc => {
        products.push({
          id: productDoc.id,
          userId, // Agregamos el ID del usuario al producto
          ...productDoc.data(),
        });
      });
    }

    return products; // Devolvemos todos los productos
  } catch (error) {
    console.error('Error al obtener productos públicos:', error);
    return []; // Si ocurre un error, devolvemos un array vacío
  }
}


}