import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { UtilService } from 'src/app/services/util.service';
import { IBarChart } from 'src/app/shared/interfaces/barchart.interface';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {

  isLoading: boolean;
  poiTweetList: IBarChart[];
  constructor(private analyticsService: AnalyticsService, private utilService: UtilService) {
      this.isLoading = false;
   }

  ngOnInit(): void {
    this.isLoading = true;
    this.analyticsService.getPoiDistribution()
    .subscribe((result: any)=>{
      this.isLoading = false;
      this.poiTweetList = this.utilService.objectToArray(result);
    });
  }

}
