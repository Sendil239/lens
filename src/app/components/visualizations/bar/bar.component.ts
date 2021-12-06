import { Component, Input, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { IBarChart } from 'src/app/shared/interfaces/barchart.interface';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss']
})

export class BarComponent implements OnInit {
  initOpts: object;
  chartOption: EChartsOption;
  
  constructor() { }

  ngOnInit(): void {
    this.initOpts = {
      renderer: 'svg',
      width: 300,
      height: 300
    };
    this.chartOption = {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
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
          data: this.barChartData.map(x=>x.name),
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [{
        type: 'value'
      }],
      series: [{
        name: this.name,
        type: 'bar',
        barWidth: '60%',
        data: this.barChartData.map(x=>x.value)
      }]
    };
  }

  @Input()
  barChartData: IBarChart[];
  @Input()
  name: string;

}
