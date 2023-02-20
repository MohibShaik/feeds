import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/core/models';
import { ApiService, AjaxService, ToasterService, DataService } from 'src/app/core/services';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { Camera, CameraOptions, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  private userId = this.storage.getItem('userId');
  public userForm: FormGroup;
  public userData: User;
  userAvator: string;
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private ajaxService: AjaxService,
    private modalController: ModalController,
    private router: Router,
    private toaster: ToasterService,
    private uploadService: FileUploadService,
    private storage: DataService
  ) {
    this.initializeUserForm();
  }

  ngOnInit() {
    this.getUserInfo()
  }

  get f() {
    return this.userForm.controls;
  }

  public initializeUserForm() {
    this.userForm = this.fb.group({
      emailAddress: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: [{ value: '', disabled: true },],
      status: [{ value: '', disabled: true },]
    });
  }

  private getUserInfo() {
    const { API_CONFIG, API_URLs } = this.apiService;
    const url = `${API_CONFIG.apiHost}${API_URLs.getUserInfo(this.userId)}`;

    const config = {
      url,
      cacheKey: false,
    };

    this.ajaxService.get(config).subscribe(response => {
      this.userData = response.data;
      this.patchFormValues()
    }, (error) => {
      console.log(error)
    })
  }

  private patchFormValues() {
    this.userForm.patchValue({
      emailAddress: this.userData.emailAddress,
      username: this.userData.username,
      password: '********',
      status: this.userData.active ? 'Active User' : 'In-Active User',
    })
  }

  public updateUserInfo() {
    const { API_CONFIG, API_URLs } = this.apiService;
    const url = `${API_CONFIG.apiHost}${API_URLs.updateUserInfo}`;

    const payload = {
      id: this.userData.id,
      username: this.userForm.controls['username'].value,
      emailAddress: this.userForm.controls['emailAddress'].value
    }
    const config = {
      url,
      data: payload,
      cacheKey: false,
    };

    this.ajaxService.put(config).subscribe(
      (response) => {
        this.closeModal(true);
        this.toaster.presentToast(response?.message, 'success-text');
        this.storage.setItem('user', response.data);
        this.router.navigate(['/dahboard/profile']);
      },
      (error) => {
        this.toaster.presentToast(error.error.message, 'error-text')
      }
    );
  }

  public closeModal(value: boolean) {
    this.modalController.dismiss(value);
  }

  takePicture = async () => {
    let camermaOptions: CameraOptions = {
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    };
    Camera.getPhoto(camermaOptions).then((imageData) => {
      this.userAvator = imageData.dataUrl;
      this.uploadUserAvator(this.userAvator);
    }, (err) => {
      console.log(err)
    });
  };

  uploadUserAvator(userAvator): void {
    if (userAvator) {
      const formData: FormData = new FormData();
      formData.append('image', userAvator);
      formData.append('id', this.userId);

      const { API_CONFIG, API_URLs } = this.apiService;
      const url = `${API_CONFIG.apiHost}${API_URLs.uploadUserAvator}`;

      this.uploadService.upload(url, formData).subscribe(
        (response: any) => {
          this.userData.imagePath = response.data.imagePath;
          // this.toaster.presentToast(response.message, 'success-text');
        },
        (err: any) => {
          console.log(err);
          this.toaster.presentToast(err, 'error-text')
        });
    }
  }

}


