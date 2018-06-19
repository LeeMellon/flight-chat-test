import { Component, ViewChild, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations'
import { ChatService } from 'app/shared/services/chat/chat.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('throbState', [
      state('sitting', style({ transform: 'scale(1)' })),
      state('smaller', style({ transform: 'scale(0.9)' })),
      state('bigger', style({ transform: 'scale(1.1)' })),
      transition('sitting => smaller', animate('675ms ease-in')),
      transition('bigger => smaller', animate('675ms ease-in')),
      transition('smaller => bigger', animate('675ms ease-in')),
      transition('smaller => sitting', animate('675ms ease-in')),
      transition('bigger => sitting', animate('675ms ease-in'))
    ])
  ]
})
export class AppComponent implements OnInit {
  @ViewChild('userInteraction') userInteraction;
  unreadMessages = false;
  throbbing = false;
  throbState = 'sitting';

  constructor(private chatSvc: ChatService) {
    const firestore = firebase.firestore();
    const settings = { timestampsInSnapshots: true };
    firestore.settings(settings);
  }

  ngOnInit() {
    this.chatSvc.unreadMessages$.subscribe(unread => {
      this.unreadMessages = unread;
      if (unread) {
        this.throb();
      }
    })
  }

  throb() {
    if (!this.throbbing) {
      this.throbState = 'smaller';
      this.throbbing = true;
    }
    setTimeout(() => {
      this.throbState = 'bigger';
      setTimeout(() => {
        this.throbState = 'smaller';
        if (this.unreadMessages) {
          this.throb();
        } else {
          this.throbState = 'sitting';
          this.throbbing = false;
        }
      }, 675);
    }, 675);
  }
}
