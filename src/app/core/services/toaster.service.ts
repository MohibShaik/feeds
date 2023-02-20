import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor(private toastController: ToastController) { }

  async presentToast(message: string, customCSSClass?: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      cssClass: 'customToaster',
    });
    toast.present();
  }

}
