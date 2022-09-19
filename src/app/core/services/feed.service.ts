import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import Pusher from 'pusher-js';

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  // public subject: Subject<Feed> = new Subject<Feed>();

  // private pusherClient: Pusher;

  // constructor() {
  //   this.pusherClient = new Pusher('2be3b67f522917ed5f33', { cluster: 'ap2' });

  //   const channel = this.pusherClient.subscribe('Feeds-development');

  //   channel.bind(
  //     'Feeds',
  //     (data: { imagePath: string; content: string; userId: string }) => {
  //       console.log(data)
  //       this.subject.next(new Feed(data.imagePath, data.content, data.userId));
  //     }
  //   );
  // }

  // getFeedItems(): Observable<Feed> {
  //   return this.subject.asObservable();
  // }
}
