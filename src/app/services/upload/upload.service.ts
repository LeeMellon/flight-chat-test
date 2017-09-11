import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { Upload } from '../upload/upload';
import { UserService } from 'app/services/user/user.service';
import { AuthService } from 'app/services/auth/auth.service';

@Injectable()
export class UploadService {
constructor(private afd: AngularFireDatabase) { }

  uploadImage(upload: Upload, key, basePath) {
    // delete old file from storage
    if (upload.url) {
      this.deleteFileStorage(key, basePath);
    };
    // put new file in storage
    const uploadTask = firebase.storage().ref().child(`${basePath}/${key}`).put(upload.file);
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        // set metadata to this instance of upload
        const snap = snapshot as firebase.storage.UploadTaskSnapshot;
        upload.url = snap.metadata.downloadURLs[0];
        upload.size = snap.metadata.size;
        upload.type = snap.metadata.contentType;
        upload.name = snap.metadata.name;
        upload.timeStamp = firebase.database.ServerValue.TIMESTAMP;
        // save metadata to live database
        this.saveImageData(upload, key, basePath);
        alert('success!');
        return undefined; // this must return undefined per angularfire
      },
      (error) => {
        alert(error);
      }
    );
  }
// writes metadata to live database
  private saveImageData(upload: Upload, key, basePath) {
    this.afd.object(`${basePath}/${key}`).set(upload)
    .catch(error => {
      console.log(error);
    });
  }

// delete files form firebase storage 
  private deleteFileStorage(key, basePath) {
    const storageRef = firebase.storage().ref();
    storageRef.child(`${basePath}/${key}`).delete();
  }

  // to return a user's profile image
  getProfileImage(userKey) {
    return this.afd.object(`uploads/profileImages/${userKey}`);
  }

  // returns an article's cover image
  getArticleCoverImage(articleKey) {
    return this.afd.object(`uploads/articleCoverImages/${articleKey}`)
  }
}




