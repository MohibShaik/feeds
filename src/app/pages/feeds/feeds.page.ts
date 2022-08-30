import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { Post, User } from 'src/app/core/models';
import { Feed } from 'src/app/core/models/feed';
import { Like } from 'src/app/core/models/like';
import { AjaxService, ApiService, DataService, ToasterService } from 'src/app/core/services';
import { CreateNewFeedsComponent } from './components/create-new-feeds/create-new-feeds.component';
import { ViewFeedComponent } from './components/view-feed/view-feed.component';

@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.page.html',
  styleUrls: ['./feeds.page.scss'],
})
export class FeedsPage implements OnInit {
  feedsList: any;
  public userInfo: User;
  public comment: string = '';

  public feeds: Feed[] = [];

  public feedSubscription: Observable<any>;
  userId: any;

  constructor(private apiService: ApiService,
    private ajaxService: AjaxService,
    private modalController: ModalController,
    private toasterservice: ToasterService,
    private storage: DataService
  ) { }

  ngOnInit() {
    this.getUserInfo()
  }

  /**
   * check for userInfo
   */
  getUserInfo() {
    this.storage.get('userId').then(data => {
      this.userId = data;
      if (this.userId) {
        this.getListOfFeeds();
      }
    });
  }

  /**
   * 
   * @param event ion refrseher event
   * returns list of feeds
   */
  getListOfFeeds(event?: any) {
    const { API_CONFIG, API_URLs } = this.apiService;
    const url = `${API_CONFIG.apiHost}${API_URLs.listOfPosts}`;

    const config = {
      url,
      cacheKey: false,
    };

    this.ajaxService.get(config).subscribe(
      (response) => {
        this.feedsList = response;
        if (event) {
          event.target.complete();
        }
        this.checkLikes();
      },
      (error) => {
        console.log(error.error);
        if (error.error.status === 403) {
          this.toasterservice.presentToast(error?.error?.message, 'error-text');
        }
      }
    );
  }

  /**
   * 
   * @param post post item
   * like or unlike a post
   */
  public likePost(post: Post) {
    const { API_CONFIG, API_URLs } = this.apiService;
    const url = `${API_CONFIG.apiHost}${API_URLs.likePostById(post.id)}`;
    const payload = {
      userId: this.userInfo.id,
    }

    const config = {
      url,
      cacheKey: false,
      data: payload
    };

    this.ajaxService.post(config).subscribe(
      (response) => {
        this.getListOfFeeds()
      },
      (error) => {
        console.log(error.error);
        if (error.error.status === 403) {
          this.toasterservice.presentToast(error?.error?.message, 'error-text');
        }
      }
    );
  }

  public unlikePost(post: Post) {
    const { API_CONFIG, API_URLs } = this.apiService;
    const url = `${API_CONFIG.apiHost}${API_URLs.unlikePostById(post.id)}`;
    const payload = {
      userId: this.userInfo.id,
    }

    const config = {
      url,
      cacheKey: false,
      data: payload
    };

    this.ajaxService.post(config).subscribe(
      (response) => {
        this.getListOfFeeds()
      },
      (error) => {
        console.log(error.error);
        if (error.error.status === 403) {
          this.toasterservice.presentToast(error?.error?.message, 'error-text');
        }
      }
    );
  }

  public addComment(post: Post) {
    if (this.comment.length) {
      const { API_CONFIG, API_URLs } = this.apiService;
      const url = `${API_CONFIG.apiHost}${API_URLs.commentPostById(post.id)}`;
      const payload = {
        userId: this.userInfo.id,
        comment: this.comment
      };
      const config = {
        url,
        cacheKey: false,
        data: payload
      };

      this.ajaxService.post(config).subscribe(
        (response) => {
          this.toasterservice.presentToast(response?.message, 'success-text');
          this.comment = '';
          this.getListOfFeeds()
        },
        (error) => {
          console.log(error.error);
          if (error.error.status === 403) {
            this.toasterservice.presentToast(error?.error?.message, 'error-text');
          }
        }
      );
    }
  }

  public checkLikes() {
    this.feedsList.forEach((element: Post) => {
      const likes = element.likes;
      const isAlreadyLiked = likes.filter(x => x.userId.username === this.userInfo.username);
      if (isAlreadyLiked.length) {
        element.canLike = false
      }
      else {
        element.canLike = true
      }
    });
  }

  /**
   * 
   * @returns creates a new feed
   */
  public async addFeed() {
    const modal = await this.modalController.create({
      component: CreateNewFeedsComponent,
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this.toasterservice.presentToast(
          'User Feed Created Successfully',
          'success-text'
        );
        this.getListOfFeeds();
      }
    });

    return await modal.present();
  }

  public async viewFeedDetails(post: Post) {
    const modal = await this.modalController.create({
      component: ViewFeedComponent,
      componentProps: { Feed: post }
    });

    modal.onDidDismiss().then((dataReturned) => {

    });

    return await modal.present();
  }
}
