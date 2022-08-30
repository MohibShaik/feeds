import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Post } from 'src/app/core/models';

@Component({
  selector: 'app-view-feed',
  templateUrl: './view-feed.component.html',
  styleUrls: ['./view-feed.component.scss'],
})
export class ViewFeedComponent implements OnInit {
  @Input() Feed: Post;
  constructor( private modalController: ModalController,) { }

  ngOnInit() {
    console.log(this.Feed)
  }

  public closeModal(value: boolean) {
    this.modalController.dismiss(value);
  }

}
