import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from "rxjs/Observable";
import * as firebase from 'firebase';


@Injectable()
export class SuggestionService {
  suggestions: FirebaseListObservable<any[]>;

  constructor(private db: AngularFireDatabase      
  ) { this.suggestions = db.list('suggestions');
  }

  getAllSuggestions() {
    return this.db.list('suggestionData/suggestions');
  };

  getSuggestionByKey(key) {
    return this.db.object(`suggestionData/suggestions/${key}`);
  }

  updateSuggestion(key, paramsToUpdate) {

    // paramsToUpdate.lastUpdated = firebase.database.ServerValue.TIMESTAMP;

    let suggestionUpdates = {
      title: paramsToUpdate.title,
      pitch: paramsToUpdate.pitch,
      lastUpdated: firebase.database.ServerValue.TIMESTAMP
    }

    let dbSuggestion = this.getSuggestionByKey(key);
    dbSuggestion.update(suggestionUpdates);

    // this.db.object(`suggestionData/suggestions/${key}`).update(paramsToUpdate);
    
  }
}
