import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AjaxService, ApiService, ToasterService } from 'src/app/core/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public loginForm: FormGroup;
  public passwordType: string = 'password';
  public passwordIcon: string = 'eye-off';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private ajaxService: AjaxService,
    private modalCtrl: ModalController,
    private router: Router,
    private toaster: ToasterService
  ) {
    this.initializeLoginForm();
  }
  ngOnInit() {

  }

  get f() {
    return this.loginForm.controls;
  }

  public initializeLoginForm() {
    this.loginForm = this.fb.group({
      emailAddress: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  public hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  public login() {
    if (this.loginForm.invalid) {
      return;
    } else {
      const { API_CONFIG, API_URLs } = this.apiService;
      const url = `${API_CONFIG.apiHost}${API_URLs.login}`;

      const config = {
        url,
        data: this.loginForm.value,
        cacheKey: false,
      };
      this.ajaxService.post(config).subscribe(
        (response) => {
          console.log(response);
          this.toaster.presentToast('Log in successful', 'success-text')
          localStorage.setItem('user', JSON.stringify(response?.user));
          localStorage.setItem('userId', JSON.stringify(response.user.id));
          localStorage.setItem('accessToken', response.accessToken);
          this.router.navigate(['dahboard']);
        },
        (error) => {
          this.toaster.presentToast(error.error.message, 'error-text')
        }
      );
    }
  }

}
