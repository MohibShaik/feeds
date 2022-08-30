import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { User } from 'src/app/core/models';

@Component({
  selector: 'app-dahboard',
  templateUrl: './dahboard.page.html',
  styleUrls: ['./dahboard.page.scss'],
})
export class DahboardPage implements OnInit {
  userInfo: User;

  constructor(public alertController: AlertController) { }

  ngOnInit() {
  }


  // async canDeactivate() {
  //   let logout: any;
  //   const alert = await this.alertController.create({
  //     cssClass: 'my-custom-class',
  //     header: 'Alert',
  //     message: 'Are you sure? you want to logout?',
  //     buttons: [
  //       {
  //         text: 'Logout',
  //         cssClass: 'alert-logout-btn',
  //         handler: () => {
  //           alert.dismiss();
  //           return true;
  //         }
  //       },
  //       {
  //         text: 'No',
  //         cssClass: 'alert-no-btn',
  //         handler: () => {
  //           alert.dismiss();
  //           return false;
  //         }
  //       },

  //     ]
  //   });

  //   await alert.present();

  //   await alert.onDidDismiss().then((data) => {
  //     if (data) {
  //       console.log(data)
  //       logout = true
  //     }
  //   })

  //   return logout

  // }


}
