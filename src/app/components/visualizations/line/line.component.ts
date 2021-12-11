import { Component, Input, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { UtilService } from 'src/app/services/util.service';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss']
})
export class LineComponent implements OnInit {
  initOpts: object;
  chartOption: any;
  lineChartData: any;
  lineSeriesData: any;

  constructor(private utilService: UtilService) {
    this.lineSeriesData = [];
   }

  ngOnInit(): void {
    this.initOpts = {
      renderer: 'svg',
      width: 7 * 210,
      height: 600
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
        data: this.lineChartData.map((x: any) => x.name)
      },
      grid: {
        left: '1%',
        right: '1%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: ['Apr 2021', 'May 2021', 'Jun 2021', 'Jul 2021', 'Aug 2021', 'Sep 2021']
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: this.lineSeriesData
    }
  }

  @Input('lineChartData')
  set lineData(data: any){
    this.lineChartData = this.utilService.objectToArray(data);
    this.lineChartData.forEach((element: any) => {
      let monthData = this.utilService.objectToArray(element.value);
      this.lineSeriesData.push({
        name: element.name,
        data: monthData.map(x => x.value)
      })
    });
    Highcharts.chart('container', {
      chart: {
        type: 'spline'
      },
      title: {
        text: 'abcd'
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: { // don't display the dummy year
          month: '%e. %b',
          year: '%b'
        },
        title: {
          text: 'Date'
        }
      },
      yAxis: {
        title: {
          text: 'Tweet Count'
        },
        min: 0
      },
      tooltip: {
        headerFormat: '<b>{series.name}</b><br>',
        pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
      },
    
      plotOptions: {
        series: {
          marker: {
            enabled: true
          }
        }
      },
    
      colors: ['#6CF', '#39F', '#06C', '#036', '#000'],
    
      // Define the data points. All series have a dummy year
      // of 1970/71 in order to be compared on the same x axis. Note
      // that in JavaScript, months start at 0 for January, 1 for February etc.
      series: this.lineSeriesData,
    
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            plotOptions: {
              series: {
                marker: {
                  radius: 2.5
                }
              }
            }
          }
        }]
      }
    });
  }
    
  @Input()
    lineTitle: string;
}
