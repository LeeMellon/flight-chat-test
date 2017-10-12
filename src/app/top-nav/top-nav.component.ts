import { Router } from '@angular/router';
import { UserInfoOpen } from './../services/user/user-info';
import { UserService } from './../services/user/user.service';
import { AuthService } from './../services/auth/auth.service';
import { AuthInfo } from './../services/auth/auth-info';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {
  isCollapsed: boolean = true;

  authInfo: AuthInfo = new AuthInfo(null, false);
  displayName: string = '';
  scrollEvent: any;
  lastScrollY: number;
  lastScrollDirection: string = 'up';
  searchInput: string;
  searchBarState: searchBarFocus = searchBarFocus.inactive;

  constructor(
    private authSvc: AuthService,
    private userSvc: UserService,
    private router: Router
  ) {
    window.onscroll = (event) => {
      this.scrollEvent = event;
      let currentScrollY = this.scrollEvent.path[1].scrollY;

      if (currentScrollY > this.lastScrollY) {
        this.lastScrollDirection = 'down';
      } else if (currentScrollY < this.lastScrollY) {
        this.lastScrollDirection = 'up';
      }
      this.lastScrollY = currentScrollY;
    }
  }

  ngOnInit() {
    this.authSvc.authInfo$.subscribe(authInfo => {
      this.authInfo = authInfo;
    });
    this.userSvc.userInfo$.subscribe((userInfo: UserInfoOpen) => {
      if (userInfo && userInfo.$key) {
        this.displayName = userInfo.alias || userInfo.fName;
      }
    });
  }

  search(query: string) {
    this.router.navigate([`articlesearch/${query}`]);
  }

  logout() {
    this.authSvc.logout();
  }

  lastScrolledUp() {
    return this.lastScrollDirection == 'up' ? true : false;
  }

  searchBarFocus() {
    if (this.searchBarState === searchBarFocus.focus) {
      return this.searchBarState = searchBarFocus.inactive;
    } else if (this.searchBarState === searchBarFocus.inactive) {
      return this.searchBarState = searchBarFocus.focus;
    }
  }
}

export enum searchBarFocus {
  'focus' = 1,
  'inactive'
}