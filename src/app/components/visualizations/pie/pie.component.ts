import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.css']
})
export class PieComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  chartInstance: any;
  initOpts = {
    renderer: 'svg',
    width: 300,
    height: 300
  };
  chartOption: EChartsOption =  {
    title: {
      text: 'Customized Pie',
      left: 'center',
      top: 20,
      textStyle: {
        color: '#ccc',
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
        data: [
          {
             "value":60000,
             "name":"Opus Mei"
          },
          {
             "value":50000,
             "name":"Blinky Scene"
          },
          {
             "value":600000,
             "name":"Governor Rover"
          },
          {
             "value":20000,
             "name":"Yeezu Joy"
          },
          {
             "value":400000,
             "name":"Mercy Windsor"
          },
          {
             "value":400000,
             "name":"Lucy Cheng"
          },
          {
             "value":200000,
             "name":"Frum Lezilia"
          }
       ],
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
