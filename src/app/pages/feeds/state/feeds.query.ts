import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { FeedsState, FeedsStore } from './feeds.store';

@Injectable({
    providedIn: 'root',
})
export class FeedsQuery extends Query<FeedsState> {
    constructor(store: FeedsStore) {
        super(store);
    }
    FeedsData$ = this.select((u) => u.feedsData);
}
