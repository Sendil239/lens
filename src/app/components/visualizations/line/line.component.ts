import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { UtilService } from 'src/app/services/util.service';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss']
})
export class LineComponent implements OnInit, AfterViewInit {
  initOpts: object;
  chartOption: any;
  lineChartData: any;
  lineSeriesData: any;

  constructor(private utilService: UtilService) {
    this.lineSeriesData = [];
   }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void{
    this.drawLineChart();
  }

  drawLineChart(){
    Highcharts.chart(this.lineContainer, {
      chart: {
        type: 'spline',
        events: {
          load: function() {
            let categoryHeight = 35;
            this.update({
              chart: {
                height: categoryHeight * 15 + (this.chartHeight - this.plotHeight)
              }
            })
          }
        }
      },
      title: {
        text: this.lineTitle
      },
      xAxis: {
        // type: 'datetime',
        // dateTimeLabelFormats: { // don't display the dummy year
        //   month: '%e. %b',
        //   year: '%b'
        // },
        title: {
          text: 'MMM yyyy'
        },
        categories: ["Apr 2021", "May 2021", "Jun 2021", "Jul 2021", "Aug 2021", "Sep 2021"]
      },
      yAxis: {
        title: {
          text: 'Tweet Count'
        },
        min: 0
      },
      tooltip: {
        headerFormat: '<b>{series.name}</b><br>',
        pointFormat: '{point.y}'
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

  @Input('lineChartData')
  set lineData(data: any){
    this.lineChartData = this.utilService.objectToArray(data);
    this.lineChartData.forEach((element: any) => {
      let monthData = this.utilService.objectToArray(element.value);
      this.utilService.sortByMonth(monthData)
      this.lineSeriesData.push({
        name: element.name,
        data: monthData.map(x => x.value)
      })
    });
  }
    
  @Input()
    lineTitle: string;
  @Input()
    lineContainer: string;
}
