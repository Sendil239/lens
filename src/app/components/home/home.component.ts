import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { filter } from 'd3-array';
import { IFilter } from 'src/app/shared/interfaces/filter.interface';
import { ITwitterData } from 'src/app/shared/interfaces/twitter_data.interface';
import { HomeService } from '../../services/home.service';

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

  constructor(private homeService: HomeService) {
    this.filterData = {
      countryList: [],
      languageList: [],
      poiList: []
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
   }

  ngOnInit(): void {
    this.filterData.countryList = ['India', 'Mexico', 'USA'];
    this.filterData.languageList = ['English', 'Hindi', 'Spanish'];
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
      'languages': filterParams?.selectedLanguages ?? []
    };

  }

  applyFilter(filterParams: any) {
    if(this.checkIfValidSearch(filterParams)){
      this.setAppliedFilter(filterParams);
      this.isGraphDataLoading = true;
      this.fetchData();
    }
  }

  fetchData(){
    this.isDataLoading = true;
      this.homeService.postFilterData({...this.appliedFilter, 'page_group': this.page_group, 'result_in_page': this.result_in_page})
      .subscribe((result: any) =>{
        this.isDataLoading = false;
        this.isGraphDataLoading = false;
        if(result){
          this.tweetsList = result.tweet_list;
          this.totalTweetsCount = result.total_tweet_count;
        }
      })
  }

  fetchMoreData(pageNumber: number) {
    this.page_group = pageNumber;
    this.fetchData();
  }

  checkIfValidSearch(filterParams: any){
    if(this.keyword != '')
      return true;

    if(filterParams.selectedPois.length == 0 || filterParams.selectedCountries.length == 0 || filterParams.selectedLanguages.length == 0)
      return true;

    return false;
  }

}
