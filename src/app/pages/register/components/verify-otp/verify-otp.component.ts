import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationMessages } from 'src/app/core/enums/messages';
import { User } from 'src/app/core/models';
import { ApiService, AjaxService, ToasterService, DataService } from 'src/app/core/services';
import { FcmService } from 'src/app/core/services/fcm.service';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss'],
})
export class VerifyOtpComponent implements OnInit {
  verificationForm: FormGroup;
  registeredUserInfo: any;
  isResend = 0;
  otp: string;
  otpBtnEnable: boolean;
  private notificationToken = this.storage.getItem('notificationToken');


  constructor(private fb: FormBuilder,
    private apiService: ApiService,
    private ajaxService: AjaxService,
    private router: Router,
    private toasterservice: ToasterService,
    private storage: DataService,
    private fcmService : FcmService) {
    this.verificationForm = this.fb.group(
      {
        verificationCode: ['', [Validators.required]],
      },
    );
  }

  ngOnInit() {
    this.getUserInfo()
  }

  private getUserInfo() {
    this.storage.get('user').then(response => {
      this.registeredUserInfo = response;
      console.log(this.registeredUserInfo);
    });
  }

  otpValue(data) {
    this.otp = '';
    for (let i = 0; i < data.otp.length; i++) {
      this.otp += data.otp[i].value;
    }
    // console.log("otp", this.otp);
    this.otpBtnEnable = this.otp.length === 6 ? true : false;
    this.verificationForm.patchValue({
      verificationCode: this.otp,
    });
  }

  public verifyOTP() {
    if (this.otp.length !== 4) {
      return;
    } else {
      const { API_CONFIG, API_URLs } = this.apiService;
      const url = `${API_CONFIG.apiHost}${API_URLs.verify}`;

      const payload = {
        emailAddress: this.registeredUserInfo?.emailAddress,
        otp: this.otp
      }

      const config = {
        url,
        data: payload,
        cacheKey: false,
      };
      this.ajaxService.post(config).subscribe(
        (response) => {
          console.log(response);
          this.toasterservice.presentToast(response?.message, 'success-text');
          this.storage.set('user', response?.data);
          this.fcmService.notificationBuilder(response?.data?.username + ' ' + NotificationMessages?.NEW_USER_SIGNUP);
          this.router.navigate(['/login']);
        },
        (error) => {
          console.log(error);
          this.toasterservice.presentToast(error?.error?.message, 'error-text');
        }
      );
    }
  }

  // private sendNotification(message: string) {
  //   const { API_CONFIG, API_URLs } = this.apiService;
  //   const url = `${API_CONFIG.apiHost}${API_URLs.sendNotification}`;

  //   const payload = {
  //     registrationToken: this.notificationToken,
  //     message: message,
  //   }

  //   const config = {
  //     url,
  //     data: payload,
  //     cacheKey: false,
  //   };
  //   this.ajaxService.post(config).subscribe(
  //     (response) => {
  //       console.log(response);
  //       this.toasterservice.presentToast('notification sent', 'success-text');
  //     },
  //     (error) => {
  //       console.log(error);
  //       this.toasterservice.presentToast(error?.error?.message, 'error-text');
  //     }
  //   );
  // }

}
