import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { ApiService, ToasterService } from 'src/app/core/services';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss'],
})
export class FavouritesComponent implements OnInit {
  @Input() favourites: any;
  @Input() userId: string;

  constructor(
    private modalController: ModalController,
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
    private toasterservice: ToasterService,
  ) { }

  ngOnInit() {
    console.log(this.userId, this.favourites)
  }

  public closeModal(value: boolean) {
    this.modalController.dismiss(value);
  }

  clickImage(image: string) {
    console.log("image clicked", image);
  }

}
