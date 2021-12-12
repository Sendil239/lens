import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { TimeseriesanalysisComponent } from './components/timeseriesanalysis/timeseriesanalysis.component';
import { WordcloudComponent } from './components/wordcloud/wordcloud.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }, {
        path: 'home',
        loadChildren: () => 
        import('./modules/home/home.module').then(m=>m.HomeModule)
      }, {
        path: 'analytics',
        loadChildren: () => 
        import ('./modules/analytics/analytics.module').then(m=>m.AnalyticsModule)
      }, {
        path: 'word_cloud',
        component: WordcloudComponent
      },
      {
        path: 'time_series_analysis',
        component: TimeseriesanalysisComponent
      },
      {
        path: 'world_analytics',
        loadChildren: () => 
        import ('./modules/world-analytics/world-analytics.module').then(m=>m.WorldAnalyticsModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
