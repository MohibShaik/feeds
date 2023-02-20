import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { AjaxService, ApiService, DataService, ToasterService } from 'src/app/core/services';
import { concat, Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

import { Camera, CameraOptions, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { finalize } from 'rxjs/operators';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';

interface LocalFile {
  name: string;
  path: string;
  data: string;
}


@Component({
  selector: 'app-create-new-feeds',
  templateUrl: './create-new-feeds.component.html',
  styleUrls: ['./create-new-feeds.component.scss'],
})
export class CreateNewFeedsComponent implements OnInit {
  public userId = this.storage.getItem('userId');
  public newFeedForm: FormGroup;
  images: LocalFile[] = [];
  imageUrl: string;
  public contentText = new FormControl('', [Validators.required]);
  public isUploading = false;

  constructor(
    private modalController: ModalController,
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
    private uploadService: FileUploadService,
    private toasterservice: ToasterService,
    private storage : DataService
  ) {
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  async ngOnInit() {

  }

  takePicture = async () => {
    let camermaOptions: CameraOptions = {
      quality: 100,
      allowEditing: true,
      saveToGallery: true,
      height: 300,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
    };
    Camera.getPhoto(camermaOptions).then((imageData) => {
      this.imageUrl = imageData.dataUrl;
    }, (err) => {
    });
  };


  uploadPicture(): void {
    if (this.imageUrl) {
      this.isUploading = true;
      const formData: FormData = new FormData();
      formData.append('image', this.imageUrl);
      formData.append('content', this.contentText.value);
      formData.append('userId', this.userId);
      console.log(formData);

      const { API_CONFIG, API_URLs } = this.apiService;
      const url = `${API_CONFIG.apiHost}${API_URLs.uploadAFeed}`;

      this.uploadService.upload(url, formData).subscribe(
        (event: any) => {
          this.isUploading = false;
          this.closeModal(true);
        },
        (err: any) => {
          this.toasterservice.presentToast(err, 'error-text')
          this.isUploading = false;
        });
    }
  }

  public closeModal(value: boolean) {
    this.modalController.dismiss(value);
  }

}
