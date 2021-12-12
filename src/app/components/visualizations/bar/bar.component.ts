import { AfterViewChecked, AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { IChart } from 'src/app/shared/interfaces/barchart.interface';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss']
})

export class BarComponent implements OnInit, AfterViewInit  {
  initOpts: object;
  chartOption: any;
  barChartData: any;
  barTitle: string;
  barContainer: string;

  constructor() {
    
  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void{
    this.drawBarChart();
  }

  drawBarChart(){
    if(this.barChartData?.length > 0 && this.barTitle != '' && this.barContainer != ''){
      Highcharts.chart(this.barContainer, {
        chart: {
          type: 'bar',
          height: 750,
          events: {
            load: function() {
              let categoryHeight = 35;
              this.update({
                chart: {
                  height: categoryHeight * 20 + (this.chartHeight - this.plotHeight)
                }
              })
            }
          }
        },
        title: {
          text: this.barTitle
        },
        xAxis: {
          categories: this.barChartData.map((x: any) => x.name),//['First', 'Second', 'Third', 'Fourth', 'Fifth'],
          crosshair: true
        },
        yAxis: {
          min: 0,
          title: {
            text: "<b>"+this.name+"</b>"
          }
        },
        tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="padding:0"><b>{point.y}</b></td></tr>',
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
                  pointWidth:20,                
                  type: 'bar',
                  showInLegend:false,
                  data: this.barChartData
                }]
      });
    }
  }

  @Input('barChartData')
    set barData(data: any){
      this.barChartData = data;
    }
    
  @Input()
    name: string;
  @Input('barTitle')
    set barChartTitle(data: any){
      this.barTitle = data;
    }

    @Input('barContainer')
    set barChartContainer(data: any){
      this.barContainer = data;
    }
    

}
