import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-timeseries',
  templateUrl: './timeseries.component.html',
  styleUrls: ['./timeseries.component.css']
})
export class TimeseriesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  initOpts = {
    renderer: 'svg',
    width: 300,
    height: 300
  };
  chartOption: EChartsOption = {
    title: {
      text: 'Dynamic Data + Time Axis'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        animation: false
      }
    },
    xAxis: {
      type: 'time',
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
      splitLine: {
        show: false
      }
    },
    series: [{
      name: 'Mocking Data',
      type: 'line',
      showSymbol: false,
      data: [[6/11/2012], 100]
    }]
  }
}
