import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface MasterData {
    [key: string]: any
}

export interface FeedsState {
    feedsData?: any[];

}

export function createInitialState(): FeedsState {
    return {};
}

@Injectable({
    providedIn: 'root',
})
@StoreConfig({ name: 'Feeds' })
export class FeedsStore extends Store<FeedsState> {
    constructor() {
        super(createInitialState());
    }
}
