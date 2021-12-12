import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/services/analytics.service';
import * as Highcharts from 'highcharts';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-wordcloud',
  templateUrl: './wordcloud.component.html',
  styleUrls: ['./wordcloud.component.scss']
})
export class WordcloudComponent implements OnInit {
  isLoading: boolean;
  hashtagsImportanceList: any;
  topicsImportanceList: any;
  Wordcloud: any;

  constructor(private analyticsService: AnalyticsService, private utilService: UtilService) { 
    this.isLoading = false;
    this.Wordcloud = require('highcharts/modules/wordcloud');
    this.Wordcloud(Highcharts);
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.analyticsService.getWordCloudData()
    .subscribe((result: any) => {
      this.topicsImportanceList = this.utilService.objectToArrayWordCloud(result.topic_importance);
      this.drawWordCloud(this.topicsImportanceList, 'topicsContainer', 'Wordcloud of Corpus Topics');
      this.hashtagsImportanceList = this.utilService.objectToArrayWordCloud(result.hashtag_distribution);
      this.drawWordCloud(this.hashtagsImportanceList, 'hashtagsContainer', 'Wordcloud of Corpus Hashtags');
      this.isLoading = false;
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

}
