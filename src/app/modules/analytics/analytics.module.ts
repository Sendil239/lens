import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { HighchartsChartModule } from 'highcharts-angular';

// components
import { AnalyticsComponent } from 'src/app/components/analytics/analytics.component';
const routes: Routes = [
  {
    path: '',
    component: AnalyticsComponent
  }
];

@NgModule({
  declarations: [AnalyticsComponent],
  imports: [RouterModule.forChild(routes), SharedModule, HighchartsChartModule],
  exports: [AnalyticsComponent]
})
export class AnalyticsModule { }
