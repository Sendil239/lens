import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-timeseriesanalysis',
  templateUrl: './timeseriesanalysis.component.html',
  styleUrls: ['./timeseriesanalysis.component.scss']
})
export class TimeseriesanalysisComponent implements OnInit {

  replySentimentXList: any;
  countryVaccineHesitancyXList: any;
  timeSeriesXList: any;
  isLoading: boolean;
  timeSeriesList: any;
  replySentimentTimeSeriesList: any;
  countryVaccineHesitancy: any;

  constructor(private analyticsService: AnalyticsService, private utilService: UtilService) {
    this.replySentimentXList = ["14 Sep 2021", "15 Sep 2021", "16 Sep 2021", "17 Sep 2021", "18 Sep 2021", "19 Sep 2021", "20 Sep 2021", "21 Sep 2021", "22 Sep 2021", "23 Sep 2021"]
    this.countryVaccineHesitancyXList = ["Jan 2021", "Feb 2021", "Mar 2021", "Apr 2021", "May 2021", "Jun 2021", "Jul 2021", "Aug 2021", "Sep 2021"]
    this.timeSeriesXList = ["Apr 2021", "May 2021", "Jun 2021", "Jul 2021", "Aug 2021", "Sep 2021"]
   }

  ngOnInit(): void {
    this.isLoading = true;
    this.analyticsService.getTimeSeriesData()
    .subscribe((result: any) => {
      this.timeSeriesList = result.all_poi_time_series_data;
      this.countryVaccineHesitancy = result.country_vaccine_hesitancy;
      this.replySentimentTimeSeriesList = result.reply_sentiment_time_series;
      this.isLoading = false;
    });
  }

}
