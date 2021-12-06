import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// components
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { BarComponent } from 'src/app/components/visualizations/bar/bar.component';
import { PieComponent } from 'src/app/components/visualizations/pie/pie.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { CategoryComponent } from 'src/app/components/visualizations/category/category.component'
import { RoseComponent } from 'src/app/components/visualizations/rose/rose.component'
import { LineComponent } from 'src/app/components/visualizations/line/line.component';
import { TimeseriesComponent } from 'src/app/components/visualizations/timeseries/timeseries.component';

import { UtilService } from 'src/app/services/util.service';

@NgModule({
  declarations: [
    BarComponent, 
    PieComponent, 
    CategoryComponent,
    RoseComponent,
    LineComponent,
    TimeseriesComponent,
  ],
  imports: [MaterialModule, 
    FormsModule, 
    ReactiveFormsModule,
    CommonModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })],
  providers: [
    UtilService
    ],
  exports: [BarComponent, PieComponent, CategoryComponent, RoseComponent, LineComponent,TimeseriesComponent, MaterialModule, CommonModule, ReactiveFormsModule, FormsModule]
})
export class SharedModule { }
