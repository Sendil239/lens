import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { UtilService } from 'src/app/services/util.service';
import { IChart } from 'src/app/shared/interfaces/barchart.interface';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {

  isLoading: boolean;
  poiTweetList: IChart[];
  countryTweetList: IChart[];
  languageTweetList: IChart[];
  timeSeriesList: any;
  constructor(private analyticsService: AnalyticsService, private utilService: UtilService) {
      this.isLoading = false;
   }

  ngOnInit(): void {
    this.isLoading = true;
    this.analyticsService.getPoiDistribution()
    .subscribe((result: any)=>{
      this.isLoading = false;
      this.poiTweetList = this.utilService.objectToArray(result);
      this.getCountryDistribution();
    });
  }

  getCountryDistribution(){
    this.isLoading = true;
    this.analyticsService.getCountryDistribution()
    .subscribe((result: any)=>{
      this.isLoading = false;
      this.countryTweetList = this.utilService.objectToArray(result);
      this.getLanguageDistribution();
    });
  }

  getLanguageDistribution(){
    this.isLoading = true;
    this.analyticsService.getLanguageDistribution()
    .subscribe((result: any)=>{
      this.isLoading = false;
      this.languageTweetList = this.utilService.objectToArray(result);  
      this.getTimeSeriesData();    
    });
  }

  getTimeSeriesData(){
    this.isLoading = true;
    this.analyticsService.getTimeSeriesData()
    .subscribe((result: any)=>{
      this.isLoading = false;
      
      this.timeSeriesList = result; 
    });
  }

}
