import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { UtilService } from 'src/app/services/util.service';
import { IChart } from 'src/app/shared/interfaces/barchart.interface';
import * as Highcharts from 'highcharts';

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
  topicsImportanceList: any;
  Wordcloud: any;
  options:any;
  isWordCloudLoading: boolean;

  constructor(private analyticsService: AnalyticsService, private utilService: UtilService) {
      this.isLoading = false;
      this.topicsImportanceList = [];    
      this.Wordcloud = require('highcharts/modules/wordcloud');
      this.Wordcloud(Highcharts);
      this.isWordCloudLoading = true;
   }

  ngOnInit(): void {
    this.isLoading = true;
    this.analyticsService.getPoiDistribution()
    .subscribe((result: any)=>{
      this.poiTweetList = this.utilService.objectToArray(result);
      this.getCountryDistribution();
    });
  }

  getCountryDistribution(){
    this.isLoading = true;
    this.analyticsService.getCountryDistribution()
    .subscribe((result: any)=>{
      this.countryTweetList = this.utilService.objectToArray(result);
      this.getLanguageDistribution();
    });
  }

  getLanguageDistribution(){
    this.isLoading = true;
    this.analyticsService.getLanguageDistribution()
    .subscribe((result: any)=>{
      this.languageTweetList = this.utilService.objectToArray(result);  
      this.getTimeSeriesData();    
    });
  }

  getTimeSeriesData(){
    this.isLoading = true;
    this.analyticsService.getTimeSeriesData()
    .subscribe((result: any) => {   
      this.timeSeriesList = result;
      this.getTopicsImportance();      
    });
  }

  getTopicsImportance(){
    this.isLoading = true;
    this.analyticsService.getTopicsImportance()
    .subscribe((result: any)=>{
      this.isLoading = false;      
      this.topicsImportanceList = this.utilService.objectToArrayWordCloud(result.topic_importance);
      Highcharts.chart('container', {
        accessibility: {
            screenReaderSection: {
                beforeChartFormat: '<h5>{chartTitle}</h5>' +
                    '<div>{chartSubtitle}</div>' +
                    '<div>{chartLongdesc}</div>' +
                    '<div>{viewTableButton}</div>'
            }
        },
        series: [{
            type: 'wordcloud',
            data: this.topicsImportanceList,
            name: 'Occurrences'
        }],
        title: {
            text: 'Wordcloud of Covid Corpus'
        }
      });
      setInterval(()=>{
        this.isWordCloudLoading = false;
      }, 1000);
      
    });  
  }

}
