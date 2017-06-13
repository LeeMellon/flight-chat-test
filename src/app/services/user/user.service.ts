import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class UserService {

  userInfo$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private authSvc: AuthService,
    private db: AngularFireDatabase
  ) {
    this.authSvc.authInfo$.subscribe(authInfo => {
      this.getUserInfo(authInfo.$uid).subscribe(info => {
        if (info.$key != "null") {
          info.$uid = info.$key;
          this.userInfo$.next(info);
        }
      })
    })
  }

  setUserRank(rank: number, uid: string) {
    return this.db.object(`userInfo/rank/${uid}`).set(rank);
  }

  createUser(userInfo, uid) {
    return this.db.object(`userInfo/open/${uid}`).set(userInfo);
  }

  getUserList() {
    return this.db.list('userInfo/open');
  }

  getUserInfo(uid): Observable<any> {
    //if (!!uid) {
    return this.db.object(`userInfo/open/${uid}`);
    //}
  }

  /*isAdmin() {
    let sub = new Subject();
    this.authSvc.authInfo$.subscribe(info => {
      if (info.$uid) {
        this.db.object(`userInfo/rank/${info.$uid}`).subscribe(rank => {
          sub.next(rank.$value >= 80);
          sub.complete();
        });
      }
    });
    return sub.asObservable();
  }*/

}