import { Component, Input, OnInit } from '@angular/core';
import { ITwitterData } from '../interfaces/twitter_data.interface';
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})
export class ListingComponent implements OnInit {
  length: number;
  pageSize: number;
  pageSizeOptions: number[];
  pageEvent: PageEvent;

  constructor() {
    this.length = 100;
    this.pageSize = 10;
    this.pageSizeOptions = [5, 10, 25, 100];
  }

  @Input('tweetsList')
  tweetsList: ITwitterData[];

  ngOnInit(): void {
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

}
