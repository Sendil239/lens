import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ITwitterData } from '../interfaces/twitter_data.interface';
import {PageEvent} from '@angular/material/paginator';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})
export class ListingComponent implements OnInit {
  
  pageSize: number;
  pageSizeOptions: number[];
  pageEvent: PageEvent;
  tweetsList: ITwitterData[];


  @Output() pageUpdated = new EventEmitter();

  constructor() {    
    this.pageSize = 10;
    this.pageSizeOptions = [5, 10, 25, 100];
  }

  @Input('tweetsList')
  set setTweetsList(data: ITwitterData[]){
    this.tweetsList = data;
    this.tweetsList.forEach((x)=> {
      let lastIndex = x.tweet_text.lastIndexOf("") > x.tweet_text.lastIndexOf(" ") ? x.tweet_text.lastIndexOf("") : x.tweet_text.lastIndexOf(" ");
      x.link = x.tweet_text.substring(x.tweet_text.indexOf("https://"), lastIndex);
    });
  }

  @Input('totalTweetsCount')
  length: number;

  ngOnInit(): void {
    this.length = 100;
  }

  paginationUpdated(data: any) {
    this.pageUpdated.emit(data.pageIndex + 1);
  }

  // format date in typescript
  getFormatedDate(date: Date, format: string) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, format);
  }

  convertToLocalDate(responseDate: any) {
    try {
        if (responseDate != null) {
            if (typeof (responseDate) === 'string') {
                if (String(responseDate.indexOf('T') >= 0)) {
                    responseDate = responseDate.split('T')[0];
                }
                if (String(responseDate.indexOf('+') >= 0)) {
                    responseDate = responseDate.split('+')[0];
                }
            }

            responseDate = new Date(responseDate);
            const newDate = new Date(responseDate.getFullYear(), responseDate.getMonth(), responseDate.getDate(), 0, 0, 0);
            const userTimezoneOffset = newDate.getTimezoneOffset() * 60000;

            const finalDate: Date = new Date(newDate.getTime() - userTimezoneOffset);
            return finalDate ? finalDate : null;
        } else {
            return null;
        }
    } catch (error) {
        return responseDate;
    }
  }

}
