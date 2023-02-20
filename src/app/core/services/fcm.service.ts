import { Injectable } from '@angular/core';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { FCM } from "@capacitor-community/fcm";
import { ApiService } from './api.service';
import { HttpService } from './http.service';
import { Notification, User } from '../models';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  public topic = 'google';
  APIUrls: any;
  currentUserInfo: User;

  constructor(private router: Router,
    private http: HttpService,
    private apiService: ApiService,
    private dataStorage: DataService) {
    this.APIUrls = this.apiService.API_URLs;
    this.getUserInfo();
  }

  private getUserInfo() {
    this.dataStorage.get('user').then(response => {
      this.currentUserInfo = response
    }).catch(error => { console.log(error) })
  }

  initPush() {
    if (Capacitor.platform !== 'web') {
      this.registerPush();
    }
  }

  private registerPush() {
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
        if (Capacitor.getPlatform() === 'ios') {
          this.topic = 'apple'
        } else if (Capacitor.getPlatform() === 'android') {
          this.topic = 'google'
        }
        this.subscribeTopic(this.topic)

      } else {
        console.log('something went wrong when requesting permissions')
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
      (token: Token) => {
        this.dataStorage.setItem('notificationToken', token)
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        console.log('Error on Push Notification registration: ' + JSON.stringify(error));
      }
    );


    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('Push received: ' + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        console.log('Push action performed: ' + JSON.stringify(notification));
      }
    );
  }

  private subscribeTopic(topicName: string) {
    FCM.subscribeTo({ topic: topicName })
      .then((r) => console.log('subscribed to topic'))
      .catch((err) => console.log(err));
  }

  public sendNotification(notification: Notification) {
    return this.http.post(this.APIUrls.sendNotification, notification)
  }

  public notificationBuilder(action: string) {
    const data = { title: `${action}`, body: 'Tap here to check the details' };
    this.sendNotification(data).subscribe()
  }
}
