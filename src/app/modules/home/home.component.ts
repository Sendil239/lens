import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { filter } from 'd3-array';
import { IFilter } from 'src/app/shared/interfaces/filter.interface';
import { ITwitterData } from 'src/app/shared/interfaces/twitter_data.interface';
import { HomeService } from './home.service';

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

  applyFilter(filterParams: any) {
    if(this.checkIfValidSearch(filterParams)){
      const filterBody = {
        'query': this.keyword,
        'poi_names': filterParams?.selectedPois ?? [],
        'countries': filterParams?.selectedCountries ?? [],
        'languages': filterParams?.selectedLanguages ?? []
      }
      this.isDataLoading = true;
      this.homeService.postFilterData(filterBody)
      .subscribe((result: any) =>{
        this.isDataLoading = false;
        if(result){
          this.tweetsList = result.tweet_list;
        }
      })
    }
  }

  checkIfValidSearch(filterParams: any){
    if(this.keyword != '')
      return true;

    if(filterParams.selectedPois.length == 0 || filterParams.selectedCountries.length == 0 || filterParams.selectedLanguages.length == 0)
      return true;

    return false;
  }

  

}
