import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import Pusher from 'pusher-js';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  constructor(private router: Router, private storage: Storage) {
    this.init()
  }

  async init() {
    await this.storage.create();
  }

  // Create and expose methods that users of this service can
  // call, for example:
  public async set(key: string, value: any) {
    await this.storage.set(key, value);
  }

  public async get(key: string) {
    const result = await this.storage.get(key) || [];
    return result
  }


  public getToken(): boolean {
    return !!this.storage.get('accessToken')
  }

  public setItem(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  public getItem(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  public logout() {
    this.storage.clear();
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }
}
