import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterPageRoutingModule } from './register-routing.module';

import { RegisterPage } from './register.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { VerifyOtpComponent } from './components/verify-otp/verify-otp.component';
import { OtpScreenComponent } from './components/otp-screen/otp-screen.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterPageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [RegisterPage, VerifyOtpComponent, OtpScreenComponent]
})
export class RegisterPageModule { }
