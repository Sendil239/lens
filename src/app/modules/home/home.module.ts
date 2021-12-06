import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// components
import { HomeComponent } from '../../components/home/home.component';
import { SearchComponent } from 'src/app/shared/search/search.component';
import { FilterComponent } from 'src/app/shared/filter/filter.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { BarComponent } from 'src/app/components/visualizations/bar/bar.component';
import { PieComponent } from 'src/app/components/visualizations/pie/pie.component';
import { ListingComponent } from 'src/app/shared/listing/listing.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { CategoryComponent } from 'src/app/components/visualizations/category/category.component'
import { RoseComponent } from 'src/app/components/visualizations/rose/rose.component'
import { LineComponent } from 'src/app/components/visualizations/line/line.component';
import { TimeseriesComponent } from 'src/app/components/visualizations/timeseries/timeseries.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  }
];

@NgModule({
  declarations: [HomeComponent, 
    SearchComponent, 
    FilterComponent, 
    BarComponent, 
    PieComponent, 
    CategoryComponent,
    RoseComponent,
    LineComponent,
    TimeseriesComponent,
    ListingComponent],
  imports: [MaterialModule, 
    FormsModule, 
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })],
  exports: [HomeComponent]
})
export class HomeModule { }
