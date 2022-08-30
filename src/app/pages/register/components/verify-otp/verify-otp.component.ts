import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/core/models';
import { ApiService, AjaxService, ToasterService, DataService } from 'src/app/core/services';

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

  constructor(private fb: FormBuilder,
    private apiService: ApiService,
    private ajaxService: AjaxService,
    private router: Router,
    private toasterservice: ToasterService,
    private storage: DataService) {
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
    });
    console.log(this.registeredUserInfo);
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
          localStorage.setItem('user', JSON.stringify(response.data));
          this.router.navigate(['/login']);
        },
        (error) => {
          console.log(error);
          this.toasterservice.presentToast(error?.error?.message, 'error-text');
        }
      );
    }
  }

}
