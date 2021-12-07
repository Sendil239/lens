import { Component, Input, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss']
})
export class LineComponent implements OnInit {
  initOpts: object;
  chartOption: any;

  constructor() { }

  ngOnInit(): void {
    this.initOpts = {
      renderer: 'svg',
      width: 7 * 150,
      height: 300
    };
    this.chartOption = {
      title: {
        text: "TimeSeries Analysis of POIs",
        left: 'center',
        top: 0,
        textStyle:{
          color:'black',
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        x: 'center',
        y: 'bottom',
        data: ['Aravind Kejriwal', 'Narendra Modi', 'Barack Obama', 'Trump', 'Claudiashein']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Aravind Kejriwal',
          type: 'line',
          stack: 'counts',
          data: [20, 13, 8, 30, 12, 5, 35]
        },
        {
          name: 'Narendira Modi',
          type: 'line',
          stack: 'counts',
          data: [10, 5, 20, 24, 18, 2, 57]
        },
        {
          name: 'Barack Obama',
          type: 'line',
          stack: 'counts',
          data: [45, 30, 35, 10, 38, 20, 13]
        },
        {
          name: 'Trump',
          type: 'line',
          stack: 'counts',
          data: [14, 20, 23, 15, 30, 26, 32]
        },
        {
          name: 'Claudiashein',
          type: 'line',
          stack: 'counts',
          data: [4, 10, 5, 10, 13, 25, 20]
        }
      ]
    }
  }

  @Input()
    lineChartData: any
  @Input()
    lineTitle: string;
}
