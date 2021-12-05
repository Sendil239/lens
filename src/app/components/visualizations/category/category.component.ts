import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  initOpts = {
    renderer: 'svg',
    width: 300,
    height: 300
  };
  chartOption : EChartsOption ={
    legend: {
      data: ['bar', 'bar2'],
      align: 'left',
    },
    tooltip: {},
    xAxis: {
      data: [1,2,3,4,5,6],
      silent: false,
      splitLine: {
        show: false,
      },
    },
    yAxis: {},
    series: [
      {
        name: 'bar',
        type: 'bar',
        data: [1.1,2.2,3.3,4.4,5.5,6.6],
        animationDelay: (idx) => idx * 10,
      },
      {
        name: 'bar2',
        type: 'bar',
        data: [-1.1,-2.2,-3.3,-4.4,-5.5,-6.6],
        animationDelay: (idx) => idx * 10 + 100,
      },
    ],
    animationEasing: 'elasticOut',
    animationDelayUpdate: (idx) => idx * 5,
  };
}
