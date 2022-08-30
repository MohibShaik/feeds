import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  constructor(private loader: LoadingController) { }

  async showHideAutoLoader() {
    await this.loader
      .create({
        message: 'Please wait...',
        duration: 1000,
      })
      .then((res) => {
        res.present();

        res.onDidDismiss().then((dis) => { });
      });
  }

  // Show the loader for infinite time
  async showLoader() {
    await this.loader
      .create({
        message: 'Please wait...',
      })
      .then((res) => {
        res.present();
      });
  }

  // Hide the loader if already created otherwise return error
  async hideLoader() {
    await this.loader
      .dismiss()
      .then((res) => {
        console.log('Loading dismissed!', res);
      })
      .catch((error) => {
        console.log('error', error);
      });
  }

  async dismiss() {
    let topLoader = await this.loader.getTop();
    while (topLoader) {
      if (!(await topLoader.dismiss())) {
        // throw new Error('Could not dismiss the topmost loader. Aborting...');
        break
      }
      topLoader = await this.loader.getTop();
    }
  }

  public loaderControl: any
  async present() {
    this.loaderControl = await this.loader.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    await this.loaderControl.present();
  }
}
