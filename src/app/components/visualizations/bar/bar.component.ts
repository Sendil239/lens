import { Component, Input, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { IChart } from 'src/app/shared/interfaces/barchart.interface';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss']
})

export class BarComponent implements OnInit {
  initOpts: object;
  chartOption: any;

  constructor() { }

  ngOnInit(): void {
    this.initOpts = {
      renderer: 'svg',
      width: this.barChartData.length > 4 ? this.barChartData.length * 170 : 300,
      height: 300
    };
    this.chartOption = {
      title: {
        text: this.barTitle,
        left: 'center',
        top: 20,
        textStyle: {
          color: 'black',
        },
      },
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
        barWidth: '25%',
        data: this.barChartData.map(x=>x.value)
      }],
      
    };
  }

  @Input()
  barChartData: IChart[];
  @Input()
  name: string;
  @Input()
  barTitle: string;

}
