import { Component, Input, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { IPoiTweet } from 'src/app/shared/interfaces/poi_tweet.interface';

@Component({
  selector: 'app-rose',
  templateUrl: './rose.component.html',
  styleUrls: ['./rose.component.css']
})
export class RoseComponent implements OnInit {
  initOpts: object;
  chartOption: any;

  constructor() { }

  ngOnInit(): void {
    this.initOpts = {
      renderer: 'svg',
      width: 300,
      height: 300
    };
    this.chartOption ={
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        x: 'center',
        y: 'bottom',
        data: this.poiTweetsList.map(a => a.name)
      },
      calculable: true,
      series: [
        {
          name: 'area',
          type: 'pie',
          radius: [30, 110],
          roseType: 'area',
          data: this.poiTweetsList
        }
      ]
    }
  }

  @Input('poiTweetsCountList')
    poiTweetsList: IPoiTweet[];  

}
