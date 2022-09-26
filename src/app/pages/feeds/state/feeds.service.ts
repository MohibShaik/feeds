import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiService } from 'src/app/core/services';
import { HttpService } from 'src/app/core/services/http.service';
import { Feed } from '../models/Feed.model';
import { FeedsStore } from './feeds.store';
import Pusher from 'pusher-js';

@Injectable({
    providedIn: 'root'
})
export class FeedsService {
    APIUrls: any;
    public FeedsSubject = new BehaviorSubject(false);
    private pusherClient: Pusher;
    feeds: any;

    constructor(private http: HttpService, private store: FeedsStore, private apiService: ApiService) {
        this.APIUrls = this.apiService.API_URLs;
        this.pusherClient = new Pusher('2be3b67f522917ed5f33', { cluster: 'ap2' });
        const channel = this.pusherClient.subscribe('Feeds-development');
        channel.bind(
            'Feeds',
            (data: Feed) => {
                console.log(data);
                this.FeedsSubject.next(true);
            }
        );
    }

    getFeedItems(): Observable<any> {
        return this.FeedsSubject.asObservable();
    }

    getListOfFeeds(): Observable<any> {
        return this.http.get(this.APIUrls.listOfPosts, null, true).pipe(tap(data => {
            this.feeds = data.data;
            return data.data
        }));
    }

    addCommentToFeed(data: any, postId: string): Observable<any> {
        console.log(data);
        return this.http.post(this.APIUrls.commentPostById(postId), data)
    }

}
