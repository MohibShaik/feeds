import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { ViewImageComponent } from './components/view-image/view-image.component';
import { UsersListComponent } from './components/users-list/users-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    SharedModule
  ],
  declarations: [ProfilePage, EditProfileComponent, ViewImageComponent ,UsersListComponent],
  entryComponents: [EditProfileComponent, ViewImageComponent ,UsersListComponent]
})
export class ProfilePageModule { }
