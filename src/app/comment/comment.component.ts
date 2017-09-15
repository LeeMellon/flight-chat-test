import { UserService } from './../services/user/user.service';
import { CommentService } from 'app/services/comment/comment.service';
import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { UserInfoOpen } from "app/services/user/user-info";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() comment;
  @Input() currentUserInfo;

  replies;
  displayName: string = '';
  editShowing: boolean = false;
  repliesShowing: boolean = false;
  dateUpdated: string = '';

  constructor(private router: Router, private commentSvc: CommentService, private userSvc: UserService) { }

  ngOnInit() {
    this.commentSvc.getCommentsByParentKey(this.comment.$key).subscribe(replies => {
      this.replies = replies;
    });

    this.userSvc.getUserInfo(this.comment.authorKey).subscribe(userInfo => {
      if (userInfo && userInfo.uid) {
        this.displayName = userInfo.alias || userInfo.fName;
      }
    });
  }

  currentUserDisplayName() {
    return this.currentUserInfo.alias || this.currentUserInfo.fName;
  }

  isLoggedInUserComment() {
    return this.currentUserInfo && this.currentUserInfo.uid === this.comment.authorKey
  }

  hasReplies() {
    return this.replies && this.replies.length > 0;
  }

  toggleEdit() {
    this.editShowing = !this.editShowing;
  }

  toggleReplies() {
    this.repliesShowing = !this.repliesShowing;
  }

  tryShowReply(addReply) {
    if(this.currentUserInfo) addReply.toggleReplyForm();
    else this.router.navigate(['login']);
  }

  isRepliesShowing() {
    return this.hasReplies() && !this.repliesShowing;
  }

  isDeletedComment() {
    return this.comment.isDeleted && this.replies && this.replies.length > 0;
  }

  deleteComment() {
    this.commentSvc.deleteComment(this.comment.$key);
  }

  navigateToProfile() {
    this.router.navigate([`profile`, this.comment.authorKey]);
  }

  timeSincePost() {
    let postTime = this.comment.lastUpdated || this.comment.timestamp
    let timeSincePost = Date.now() - postTime;
    switch(true) {
      case timeSincePost >= 63072000000:
        return `${Math.floor(timeSincePost / 31536000000)} years ago`
      case timeSincePost >= 31536000000:
        return "1 year ago"
      case timeSincePost >= 5184000000:
        return `${Math.floor(timeSincePost / 2592000000)} months ago`
      case timeSincePost >= 2592000000:
        return "1 month ago"
      case timeSincePost >= 1209600000:
        return `${Math.floor(timeSincePost / 6048000000)} weeks ago`
      case timeSincePost >= 6048000000:
        return "1 week ago"
      case timeSincePost >= 172800000:
        return `${Math.floor(timeSincePost / 86400000)} days ago`
      case timeSincePost >= 86400000:
        return "1 day ago"
      case timeSincePost >= 7200000:
        return `${Math.floor(timeSincePost / 3600000)} hours ago`
      case timeSincePost >= 3600000:
        return "1 hour ago"
      case timeSincePost >= 120000:
        return `${Math.floor(timeSincePost / 60000)} minutes ago`
      case timeSincePost >= 60000:
        return "1 minute ago"
      case timeSincePost > 0:
        return "just now"
    }
  }
}
