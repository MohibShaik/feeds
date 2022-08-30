import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {

  public forgotPasswordForm : FormGroup;
  constructor(private fb : FormBuilder) { }

  ngOnInit() {
    this.initializeForm()
  }

  private initializeForm(){
    this.forgotPasswordForm = this.fb.group({
      emailAddress :['', [Validators.required, Validators.email]],
      password :['', [Validators.required]],
      confirmPassword :['', [Validators.required]],
    })
  }

  get f(){
    return this.forgotPasswordForm.controls
  }

}
