import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { filter } from 'd3-array';
import { IChart } from 'src/app/shared/interfaces/barchart.interface';
import { IFilter } from 'src/app/shared/interfaces/filter.interface';
import { IPoiTweet, CountryTweetCount } from 'src/app/shared/interfaces/poi_tweet.interface';
import { ITwitterData } from 'src/app/shared/interfaces/twitter_data.interface';
import { HomeService } from '../../services/home.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  filterData: IFilter;
  isDataLoading: boolean;
  tweetsList: ITwitterData[];
  isError: boolean = false;
  keyword: string;
  rowHeight: number;
  isFilterLoading: boolean;
  page_group: number;
  result_in_page: number;
  appliedFilter: any;
  isGraphDataLoading: boolean;
  totalTweetsCount: number;
  countryTweetData: IChart[];
  poiTweetData: IChart[];
  poiRepliesSentimentAnalysisData: IChart[];
  poiReplyData: IChart[];

  constructor(private homeService: HomeService, private utilService: UtilService) {
    this.filterData = {
      countryList: [],
      languageList: [],
      poiList: [],
      topicList: []
    };
    this.tweetsList = [];
    this.keyword = "";
    this.rowHeight = 75;
    this.isDataLoading = false;
    this.isFilterLoading = false;
    this.result_in_page = 10;
    this.page_group = 1;
    this.isGraphDataLoading = false;
    this.totalTweetsCount = 0;
    this.countryTweetData = [];
    this.poiTweetData = [];
    this.poiRepliesSentimentAnalysisData = [];
    this.poiReplyData = [];
   }

  ngOnInit(): void {
    this.filterData.countryList = ['India', 'Mexico', 'USA'];
    this.filterData.languageList = ['English', 'Hindi', 'Spanish'];
    this.filterData.topicList = ["president", "covid", "state", "country", "election", "congress", "pass", "voter", "thank", "life", "government", "today", "marriage", "supreme", "disease", "pandemic"];
    this.isFilterLoading = true;
    this.homeService.getPois()
      .subscribe(result => {
        this.isFilterLoading = false;
        if(result){
          this.filterData.poiList = result.poi_names;
        }
      })
  }
    
  searchKeyword() {
      if (this.keyword != '') {
          this.applyFilter([]);
      }
  }

  setAppliedFilter(filterParams: any){
    this.appliedFilter = {
      'query': this.keyword,
      'poi_names': filterParams?.selectedPois ?? [],
      'countries': filterParams?.selectedCountries ?? [],
      'languages': filterParams?.selectedLanguages ?? [],
      'topics': filterParams?.selectedTopics ?? []
    };

  }

  applyFilter(filterParams: any) {
    if(this.checkIfValidSearch(filterParams)){
      this.setAppliedFilter(filterParams);
      this.isGraphDataLoading = true;
      this.fetchData(true);
    }
  }

  fetchData(isFilterSearch: boolean){
    this.isDataLoading = true;
      this.homeService.postFilterData({...this.appliedFilter, 'page_group': this.page_group, 'result_in_page': this.result_in_page})
      .subscribe((result: any) => {
        this.isDataLoading = false;
        this.isGraphDataLoading = false;
        if(result){
          this.tweetsList = result.tweet_list;
          this.totalTweetsCount = result.total_tweet_count;          
          if(isFilterSearch){
            this.countryTweetData = this.utilService.objectToArray(result.country_tweet_count);
            this.poiTweetData = this.utilService.objectToArray(result.poi_tweet_count);
            this.poiRepliesSentimentAnalysisData = this.utilService.objectToArray(result.poi_reply_sentiment);
            this.poiReplyData = this.utilService.objectToArray(result.poi_reply_count);
          }
        }
      })
  }

  fetchMoreData(pageNumber: number) {
    this.page_group = pageNumber;
    this.fetchData(false);
  }

  checkIfValidSearch(filterParams: any){
    if(this.keyword != '')
      return true;

    if(filterParams.selectedPois.length == 0 || filterParams.selectedCountries.length == 0 || filterParams.selectedLanguages.length == 0)
      return true;

    return false;
  }

}
