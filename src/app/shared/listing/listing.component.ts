import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ITwitterData } from '../interfaces/twitter_data.interface';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})
export class ListingComponent implements OnInit {
  
  pageSize: number;
  pageSizeOptions: number[];
  pageEvent: PageEvent;

  @Output() pageUpdated = new EventEmitter();

  constructor() {    
    this.pageSize = 10;
    this.pageSizeOptions = [5, 10, 25, 100];
  }

  @Input('tweetsList')
  tweetsList: ITwitterData[];

  @Input('totalTweetsCount')
  length: number;

  ngOnInit(): void {
    this.length = 100;
  }

  paginationUpdated(data: any) {
    this.pageUpdated.emit(data.pageIndex + 1);
}

}
