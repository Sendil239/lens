import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// components
import { AnalyticsComponent } from './analytics.component';
const routes: Routes = [
  {
    path: '',
    component: AnalyticsComponent
  }
];

@NgModule({
  declarations: [AnalyticsComponent],
  imports: [RouterModule.forChild(routes)],
  exports: [AnalyticsComponent]
})
export class AnalyticsModule { }
