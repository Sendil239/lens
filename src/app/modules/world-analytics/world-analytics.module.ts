import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorldAnalyticsComponent } from 'src/app/components/world-analytics/world-analytics.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: WorldAnalyticsComponent
  }
];

@NgModule({
  declarations: [WorldAnalyticsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [WorldAnalyticsComponent]
})
export class WorldAnalyticsModule { }
