import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { Post, User } from 'src/app/core/models';
import { Like } from 'src/app/core/models/like';
import { AjaxService, ApiService, DataService, ToasterService } from 'src/app/core/services';
import { AddCommentComponent } from './components/add-comment/add-comment.component';
import { CreateNewFeedsComponent } from './components/create-new-feeds/create-new-feeds.component';
import { ViewFeedComponent } from './components/view-feed/view-feed.component';
import { FeedsQuery } from './state/feeds.query';
import { FeedsService } from './state/feeds.service';

@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.page.html',
  styleUrls: ['./feeds.page.scss'],
})
export class FeedsPage implements OnInit, OnDestroy {
  feedsList: any;
  feedsList$: Observable<any>;
  public comment: string = '';
  private userId: string;

  constructor(private apiService: ApiService,
    private ajaxService: AjaxService,
    private modalController: ModalController,
    private toasterservice: ToasterService,
    private storage: DataService,
    private feedsService: FeedsService,
    public query: FeedsQuery
  ) {
    this.userId = localStorage.getItem('userId');
  }

  ngOnInit() {
    this.getListOfFeeds();
  }
  /**
   * 
   * @param event ion refrseher event
   * returns list of feeds
   */
  getListOfFeeds(event?: any) {
    this.feedsService.getListOfFeeds().subscribe(response => {
      console.log(response);
      this.feedsList = response.data;
      if (event) {
        event.target.complete();
      }
      if (response.data.length) {
        this.checkLikes();
        this.checkForNewFeeds();
        this.feedsService.FeedsSubject.next(false);
      }
    }, (error) => {
      console.log(error.error);
      if (error.error.status === 403) {
        this.toasterservice.presentToast(error?.error?.message, 'error-text');
      }
    })
  }

  private checkForNewFeeds() {
    this.feedsList$ = this.feedsService.getFeedItems();
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
      userId: this.userId,
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
      userId: this.userId,
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

  public async openCommentDialog(post: Post) {
    const modal = await this.modalController.create({
      component: AddCommentComponent,
      breakpoints: [0, 0.3, 0.5, 0.8],
      initialBreakpoint: 1,
      componentProps: { post: post, userId: this.userId }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {

      }
    });

    return await modal.present();
  }

  public addComment(post: Post) {
    if (this.comment.length) {
      const { API_CONFIG, API_URLs } = this.apiService;
      const url = `${API_CONFIG.apiHost}${API_URLs.commentPostById(post.id)}`;
      const payload = {
        userId: this.userId,
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
      const isAlreadyLiked = likes.filter(x => x.userId.id === this.userId);
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

  ngOnDestroy(): void {

  }
}
