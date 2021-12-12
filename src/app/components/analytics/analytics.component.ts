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
  poiTweetList: any;
  countryTweetList: IChart[];
  languageTweetList: IChart[];
  Wordcloud: any;
  options:any;
  vaccineHesitancy: any;

  constructor(private analyticsService: AnalyticsService, private utilService: UtilService) {
      this.isLoading = false;  
      this.Wordcloud = require('highcharts/modules/wordcloud');
      this.Wordcloud(Highcharts);
   }

  ngOnInit(): void {
    this.isLoading = true;
    this.analyticsService.getCorpusChartData()
    .subscribe((result: any) => {
      this.poiTweetList = this.utilService.objectToArrayData(result.poi_tweet_distribution);
      this.countryTweetList = this.utilService.objectToArray(result.country_distribution);
      this.languageTweetList = this.utilService.objectToArray(result.lang_distribution);
      this.vaccineHesitancy = this.utilService.objectToArray(result.vaccine_hesitancy);
      this.isLoading = false;
      this.drawVaccineHesitancyColumnCloud(this.vaccineHesitancy, 'vaccineHesitancyContainer', 'Attitude Score of POIs');
      this.drawVaccineHesitancyTweetColumnCloud(this.vaccineHesitancy, 'vaccineHesitancyTweetContainer', 'Covid vaccine and other tweet counts of POIs');
    });
  }

  drawVaccineHesitancyColumnCloud(data: any, container:string, titleText:string){
    Highcharts.chart(container, {
      chart: {
        type: 'column'
      },
      title: {
        text: titleText
      },
      xAxis: {
        categories: data.map((x:any)=>x.name),
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Score'
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.3f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [{
        type: 'column',
        name: 'Score from Covid vaccine related tweets',
        data: data.map((x:any)=>x.value.covid_sentiment)
    
      }, {
        type: 'column',
        name: 'Score from other tweets',
        data: data.map((x:any)=>x.value.non_covid_sentiment)
    
      }]
    });
  }

  drawVaccineHesitancyTweetColumnCloud(data: any, container:string, titleText:string){
    Highcharts.chart(container, {
      chart: {
        type: 'column'
      },
      title: {
        text: titleText
      },
      xAxis: {
        categories: data.map((x:any)=>x.name),
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Tweet Count'
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [{
        type: 'column',
        name: 'Covid Vaccine Related Tweets',
        data: data.map((x:any)=>x.value.covid)
    
      }, {
        type: 'column',
        name: 'Other Tweets',
        data: data.map((x:any)=>x.value.non_covid)
    
      }]
    });
  }

}
