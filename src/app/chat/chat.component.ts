import { Component, OnInit, OnChanges } from '@angular/core';
import { ChatService } from '../services/chat/chat.service'
import { UserService } from './../services/user/user.service';
 
@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  // @Input() recipientKey;
  messages;
  currentUserInfo;
  recipientKey: string = "";
  //currentChatKey: string;

  constructor(
    private chatSvc: ChatService,
    private userSvc: UserService
  ) { }
  
  ngOnInit() {
    this.userSvc.userInfo$.subscribe(userInfo => {
      this.currentUserInfo = userInfo;
    });      
    this.chatSvc.currentChatKey$.subscribe(key => {
      if (key) {
        this.chatSvc.getMessagesForCurrentChat().take(1).subscribe(messages => {
          this.messages = messages;
          this.updateMessagesSeenAndTotalMessages(this.currentUserInfo.$key, this.messages.length);
          this.niceScroll();          
        })
      } else {
        this.chatSvc.getAllMessages().subscribe(messages => {
          this.messages = messages;
        });
      }
    })
    
  }

  updateMessagesSeenAndTotalMessages(user, totalMessages) {
    this.chatSvc.updateMessagesSeenCount(user, totalMessages);
    this.chatSvc.updateTotalMessagesCount(totalMessages);
  }

  niceScroll() {
      document.getElementById('message-list').scrollTop = document.getElementById('message-list').scrollHeight;
  }

  sendMessage(message) {
    let authorName = this.currentUserInfo.alias ? this.currentUserInfo.alias : this.currentUserInfo.fName;
    let messageData = {
      sentBy: this.currentUserInfo.$key,
      authorName: authorName,
      //recipientKey: this.recipientKey,
      body: message.text,
    }
    this.chatSvc.saveMessage(messageData);
    message.clearForm();
  }

  isOwnMessage(authorKey) {
    return this.currentUserInfo && authorKey == this.currentUserInfo.$key;
  }
}
