import { UploadService } from './../services/upload/upload.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from './../services/article/article.service';

@Component({
  selector: 'latest-preview',
  templateUrl: './latest-preview.component.html',
  styleUrls: ['./latest-preview.component.scss']
})
export class LatestPreviewComponent implements OnInit {
  @Input() articleData: any;
  @Input() authorKey;
  author;
  profileImageUrl;
  articleCoverImageUrl;

  constructor(
    private articleSvc: ArticleService,
    private router: Router,
    private uploadSvc: UploadService
  ) { }

  ngOnInit() {
    this.articleSvc.getAuthorByKey(this.articleData.authorKey).subscribe(author => {
      this.author = author;
    });
    this.getProfileImage();
    this.getArticleCoverImage();
  }

  navigateToArticleDetail() {
    this.articleSvc.navigateToArticleDetail(this.articleData.$key);
  }

  navigateToProfile() {
    this.articleSvc.navigateToProfile(this.articleData.authorKey);
  }

  getProfileImage() {
    this.uploadSvc.getProfileImage(this.articleData.authorKey).subscribe(profileData => {
      if (profileData.url) {
       this.profileImageUrl = profileData.url;
      }
    });
  }

  getArticleCoverImage() {
    this.uploadSvc.getArticleCoverImage(this.articleData.$key).subscribe(articleData => {
      if (articleData.url) {
        this.articleCoverImageUrl = articleData.url;
      }
    });
  }
}
