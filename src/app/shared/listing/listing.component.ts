import { Component, Input, OnInit } from '@angular/core';
import { ITwitterData } from '../interfaces/twitter_data.interface';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})
export class ListingComponent implements OnInit {
  
  constructor() {
  }

  @Input('tweetsList')
  tweetsList: ITwitterData[];

  ngOnInit(): void {
  }

}
