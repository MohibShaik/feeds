import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Post, User } from 'src/app/core/models';
import { AjaxService, ApiService, DataService, ToasterService } from 'src/app/core/services';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { Camera, CameraOptions, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { ViewImageComponent } from './components/view-image/view-image.component';
import { UsersListComponent } from './components/users-list/users-list.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  public userData: User;
  public userFeeds$: Observable<any>;
  private userId: string;
  userAvator: string;

  constructor(
    private apiService: ApiService,
    private ajaxService: AjaxService,
    private router: Router,
    private toasterservice: ToasterService,
    private storage: DataService,
    public modalController: ModalController,
    private uploadService: FileUploadService,
  ) { }

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
    if (this.userId) {
      this.getUserInfo(this.userId);
    }
  }

  getUserFeeds(event?: any) {
    const { API_CONFIG, API_URLs } = this.apiService;
    const url = `${API_CONFIG.apiHost}${API_URLs.userFeedsById(this.userId)}`;

    const config = {
      url,
      cacheKey: false,
    };

    this.userFeeds$ = this.ajaxService.get(config)
  }

  public async openEditDialog() {
    const modal = await this.modalController.create({
      component: EditProfileComponent,
    });

    modal.onDidDismiss().then((response) => {
      console.log(response)
      if (response.data) {
        this.getUserInfo(this.userId)
      }
    });

    return await modal.present();
  }

  private getUserInfo(userId: string) {
    const { API_CONFIG, API_URLs } = this.apiService;
    const url = `${API_CONFIG.apiHost}${API_URLs.getUserInfo(userId)}`;

    const config = {
      url,
      cacheKey: false,
    };

    this.ajaxService.get(config).subscribe(response => {
      this.userData = response.data;
      this.getUserFeeds()
    }, (error) => {
      console.log(error)
    })
  }

  public async viewProfilePicture(imagePath: string) {
    console.log(imagePath);
    const modal = await this.modalController.create({
      component: ViewImageComponent,
      componentProps: { image: imagePath },
      showBackdrop: true
    });

    modal.onDidDismiss().then((response) => {
      console.log(response)
    });

    return await modal.present();
  }

  public async viewUsersList() {
    const modal = await this.modalController.create({
      component: UsersListComponent,
      showBackdrop: true
    });

    modal.onDidDismiss().then((response) => {
      console.log(response)
    });

    return await modal.present();
  }

  public logout() {
    this.storage.logout();
  }

}
