import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
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
    public subject: Subject<Feed> = new Subject<Feed>();
    private pusherClient: Pusher;

    constructor(private http: HttpService, private store: FeedsStore, private apiService: ApiService) {
        this.APIUrls = this.apiService.API_URLs;
        this.pusherClient = new Pusher('2be3b67f522917ed5f33', { cluster: 'ap2' });
        const channel = this.pusherClient.subscribe('Feeds-development');
        channel.bind(
            'Feeds',
            (data: Feed) => {
                console.log(data);
                this.setFeedsData(data);
                this.subject.next(data);
            }
        );
    }

    setFeedsData(data: any): void {
        this.store.update({ feedsData: data });
    }

    getListOfFeeds(): Observable<any> {
        return this.http.get(this.APIUrls.listOfPosts, null, true).pipe(
            map((data: any) => {
                console.log(data);
                this.setFeedsData(data.data);
                return data;
            })
        );
    }

}
