import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import Pusher from 'pusher-js';
import { Subject, Observable } from 'rxjs';
import { Feed } from '../models/feed';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private subject: Subject<Feed> = new Subject<Feed>();

  private pusherClient: Pusher;

  constructor(private router: Router, private storage: Storage) {
    this.init();
    this.pusherClient = new Pusher('2be3b67f522917ed5f33', { cluster: 'ap2' });
    const channel = this.pusherClient.subscribe('realtime-feeds');
    channel.bind(
      'posts',
      (data: { content: string; imagePath: string; userId: string }) => {
        console.log(data);
        this.subject.next(new Feed(data.content, data.imagePath, data.userId));
      }
    );
  }
  private _storage: Storage | null = null;

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Create and expose methods that users of this service can
  // call, for example:
  public set(key: string, value: any) {
    this.storage?.set(key, value);
  }

  public async get(key: string) {
    await this.storage.get(key)
  }

  // public getCurrentUserInfo() {
  //   const userData = JSON.parse(localStorage.getItem('user'));
  //   return userData;
  // }

  public getToken(): boolean {
    return !!this._storage.get('accessToken')
  }


  getFeedItems(): Observable<Feed> {
    return this.subject.asObservable();
  }
  public logout() {
    this._storage.clear();
    this.router.navigateByUrl('/login');
  }
}
