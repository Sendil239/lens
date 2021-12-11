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
  hashtagsImportanceList: any;

  constructor(private analyticsService: AnalyticsService, private utilService: UtilService) {
      this.isLoading = false;
      this.topicsImportanceList = [];    
      this.Wordcloud = require('highcharts/modules/wordcloud');
      this.Wordcloud(Highcharts);
      this.isWordCloudLoading = true;
   }

  ngOnInit(): void {
    this.isLoading = true;
    this.analyticsService.getCorpusChartData()
    .subscribe((result: any) => {
      this.poiTweetList = this.utilService.objectToArray(result.poi_tweet_distribution);
      this.countryTweetList = this.utilService.objectToArray(result.country_distribution);
      this.languageTweetList = this.utilService.objectToArray(result.lang_distribution);  
      this.timeSeriesList = result.all_poi_time_series_data;
      this.topicsImportanceList = this.utilService.objectToArrayWordCloud(result.topic_importance);
      this.isLoading = false;
      this.drawWordCloud(this.topicsImportanceList, 'topicsContainer', 'Wordcloud of Covid Corpus');
      this.isWordCloudLoading = true;
      this.hashtagsImportanceList = this.utilService.objectToArrayWordCloud(result.hashtag_distribution);
      this.drawWordCloud(this.hashtagsImportanceList, 'hashtagsContainer', 'Wordcloud of Covid Hastags');      
    });
  }

  drawWordCloud(data: any, container: string, titleText: string){
      Highcharts.chart(container, {
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
            data,
            name: 'Occurrences'
        }],
        title: {
            text: titleText
        }
      });
      setInterval(()=>{
        this.isWordCloudLoading = false;
      }, 1000);
  }

}
