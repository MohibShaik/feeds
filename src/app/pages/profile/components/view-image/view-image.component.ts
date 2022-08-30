import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-view-image',
  templateUrl: './view-image.component.html',
  styleUrls: ['./view-image.component.scss'],
})
export class ViewImageComponent implements OnInit {

  @Input() image: string
  constructor(private modalController: ModalController) { }

  ngOnInit() {
    console.log(this.image)
  }

  public closeModal(value: boolean) {
    this.modalController.dismiss(value);
  }

  public downloadImage(url: string, fileName?: string) {
    const a = document.createElement('a');
    a.href = url;
    a.download = "fileName";
    document.body.appendChild(a);
    a.click();
  };

}
