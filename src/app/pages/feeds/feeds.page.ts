import { Component, OnDestroy, OnInit } from '@angular/core';
import { Directory, Filesystem, FilesystemDirectory } from '@capacitor/filesystem';
import { ModalController } from '@ionic/angular';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { NotificationMessages } from 'src/app/core/enums/messages';
import { Post, User } from 'src/app/core/models';
import { Like } from 'src/app/core/models/like';
import { AjaxService, ApiService, DataService, ToasterService } from 'src/app/core/services';
import { FcmService } from 'src/app/core/services/fcm.service';
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
  favouritePosts: any;
  private user: User

  constructor(private apiService: ApiService,
    private ajaxService: AjaxService,
    private modalController: ModalController,
    private toasterservice: ToasterService,
    private fcmService: FcmService,
    private feedsService: FeedsService,
    public query: FeedsQuery,
    private dataStorage: DataService
  ) {
    this.userId = this.dataStorage.getItem('userId');
    this.getUserInfo();
  }

  ngOnInit() {
    // this.getListOfFeeds();
  }

  ionViewWillEnter() {
    this.getFavouritePostsByUserId();
    this.getListOfFeeds();
  }

  private getUserInfo() {
    this.dataStorage.get('user').then(response => {
      this.user = response
    }).catch(error => { console.log(error) })
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

  private getFavouritePostsByUserId() {
    this.feedsService.getFavouritePosts(this.userId).subscribe(response => {
      this.favouritePosts = response.data;
      console.log(this.favouritePosts, 'fav');
    })
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
        this.fcmService.notificationBuilder(NotificationMessages?.LIKE_POST);
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
        this.fcmService.notificationBuilder(NotificationMessages?.DISLIKE_POST);
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

    modal.onDidDismiss().then((response) => {
      if (response.data) {
        this.fcmService.notificationBuilder(NotificationMessages?.COMMENT_POST);
        this.getListOfFeeds()
      }
    });

    return await modal.present();
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

  public checkFavourites(post: Post) {
    return this.favouritePosts?.filter(favourite => favourite?.postId?.id === post?.id).length > 0
  }

  public removeFavourites(post: Post) {
    const payload = {
      postId: post?.id
    }
    this.feedsService.removeFavorites(payload, this.userId).subscribe(response => {
      if (response) {
        this.getFavouritePostsByUserId()
      }
    })
  }

  public addFavourites(post: Post) {
    const payload = {
      postId: post?.id,
      userId: this.userId
    }
    this.feedsService.addFavorites(payload, this.userId).subscribe(response => {
      if (response) {
        this.fcmService.notificationBuilder(NotificationMessages?.FAVOURITE_POST);
        this.getFavouritePostsByUserId()
      }
    })
  }

  public async downloadFeed(post: Post) {
    // retrieve the image
    const response = await fetch(post?.imagePath);
    // convert to a Blob
    const blob = await response.blob();
    // convert to base64 data, which the Filesystem plugin requires
    const base64Data = await this.convertBlobToBase64(blob) as string;

    // const savedFile = await Filesystem.writeFile({
    //   path: 'test',
    //   data: base64Data,
    //   directory: FilesystemDirectory.Data
    // });

    // Write the file to the data directory
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    // Use webPath to display the new image instead of base64 since it's
    // already loaded into memory
    return {
      filepath: fileName,
    };

  }

  // helper function
  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  ngOnDestroy(): void { }
}
