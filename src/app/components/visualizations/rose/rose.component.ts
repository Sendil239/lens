import { Component, Input, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { IChart } from 'src/app/shared/interfaces/barchart.interface';

@Component({
  selector: 'app-rose',
  templateUrl: './rose.component.html',
  styleUrls: ['./rose.component.scss']
})
export class RoseComponent implements OnInit {
  initOpts: object;
  chartOption: any;

  constructor() { }

  ngOnInit(): void {
    this.initOpts = {
      renderer: 'svg',
      width: 320,
      height: 300
    };
    this.chartOption ={
      title: {
        text: this.roseTitle,
        left: 'center',
        top: 10,
        textStyle:{
          color:'black',
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        x: 'center',
        y: 'bottom',
        data: this.roseChartData.map(a => a.name)
      },
      calculable: true,
      series: [
        {
          name: 'area',
          type: 'pie',
          radius: [30, 110],
          roseType: 'area',
          data: this.roseChartData
        }
      ]
    }
  }

  @Input()
    roseChartData: IChart[];
  @Input()
    roseTitle: string;


}
