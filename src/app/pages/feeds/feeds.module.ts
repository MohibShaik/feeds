import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FeedsPageRoutingModule } from './feeds-routing.module';

import { FeedsPage } from './feeds.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateNewFeedsComponent } from './components/create-new-feeds/create-new-feeds.component';
import { ViewFeedComponent } from './components/view-feed/view-feed.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FeedsPageRoutingModule,
    SharedModule,
  ],
  declarations: [FeedsPage, CreateNewFeedsComponent, ViewFeedComponent],
  entryComponents: [CreateNewFeedsComponent, ViewFeedComponent]
})
export class FeedsPageModule { }
