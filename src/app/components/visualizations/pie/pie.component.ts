import { Component, Input, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { IPoiTweet } from 'src/app/shared/interfaces/poi_tweet.interface';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.css']
})
export class PieComponent implements OnInit {
  initOpts: object;
  chartOption: any;

  constructor() { }

  ngOnInit(): void {
    this.initOpts = {
      renderer: 'svg',
      width: 300,
      height: 300
    };
    this.chartOption= {
      title: {
        text: 'POIs Vs Tweet Count',
        left: 'center',
        top: 20,
        textStyle: {
          color: 'black',
        },
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          data: this.poiTweetsList,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

  }
  @Input('poiTweetsCountList')
    poiTweetsList: IPoiTweet[];
}
