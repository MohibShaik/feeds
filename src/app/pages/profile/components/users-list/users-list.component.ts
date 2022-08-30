import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/core/models';
import { ApiService, AjaxService, ToasterService } from 'src/app/core/services';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
  public usersList: User[];

  constructor(
    private apiService: ApiService,
    private ajaxService: AjaxService,
    private modalController: ModalController,
    private router: Router,
    private toaster: ToasterService,
  ) { }

  ngOnInit() {
    this.getUsersList();
  }

  private getUsersList(){
    const { API_CONFIG, API_URLs } = this.apiService;
    const url = `${API_CONFIG.apiHost}${API_URLs.getUsersList}`;

    const config = {
      url,
      cacheKey: false,
    };

    this.ajaxService.get(config).subscribe(response => {
      console.log(response);
      this.usersList = response.data;
    }, (error) => {
      console.log(error)
    })
  }

  public closeModal(value: boolean) {
    this.modalController.dismiss(value);
  }


}
