import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    IonicModule,
    FormsModule
  ],
  exports: [
    ReactiveFormsModule,
    FlexLayoutModule,
    ForgotPasswordComponent
  ]
})
export class SharedModule { }
