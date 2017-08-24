import { AuthService } from './../services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { SuggestionService } from './../services/suggestion/suggestion.service'
import { FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.scss'],
  providers: [ SuggestionService ]
})

export class SuggestionsComponent implements OnInit {
  suggestions;
  currentUserKey;
  currentSortOption = 'newest';
  constructor(private suggestionService: SuggestionService, private authSvc: AuthService) { }

  ngOnInit() {
    this.authSvc.authInfo$.subscribe(authInfo => {
      this.currentUserKey = (authInfo.$uid) ? authInfo.$uid : null;
    })
    
    this.suggestionService.getAllSuggestions()
      .subscribe(suggestions => {
        this.suggestions = suggestions;
      });
  }

  isSelected(sortOption) {
    return sortOption === this.currentSortOption;
  }

  sortBy(sortOption) {
    this.currentSortOption = sortOption;
  }
}
