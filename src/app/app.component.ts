import { Component } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';
import { FcmService } from './core/services/fcm.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private fcmService: FcmService
  ) { 
    this.initializeApp()
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Trigger the push setup 
      this.fcmService.initPush();
    });
  }
}
