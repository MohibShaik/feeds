import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Comment, Post } from 'src/app/core/models';
import { ToasterService } from 'src/app/core/services';
import { FeedsService } from '../../state/feeds.service';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss'],
})
export class AddCommentComponent implements OnInit {
  @Input() post: Post;
  @Input() userId: string;

  public newComment: string = '';
  constructor(
    private modalController: ModalController,
    private toasterservice: ToasterService,
    private feedsService: FeedsService
  ) { }

  ngOnInit() {
    console.log(this.post)
  }

  public closeModal(value: boolean) {
    this.modalController.dismiss(value);
  }

  public addComment() {
    const data = {
      userId: this.userId,
      comment: this.newComment
    }
    this.feedsService.addCommentToFeed(data, this.post.id).subscribe(response => {
      console.log(response);
      this.post = response?.data;
      this.newComment = "";
      this.modalController.dismiss(true);
    })
  }

}
