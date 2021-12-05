import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// components
import { HomeComponent } from './home.component';
import { SearchComponent } from 'src/app/shared/search/search.component';
import { FilterComponent } from 'src/app/shared/filter/filter.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { BarComponent } from 'src/app/visualizations/bar/bar.component';
import { PieComponent } from 'src/app/visualizations/pie/pie.component';
import { ScatterComponent } from 'src/app/visualizations/scatter/scatter.component';
import { ListingComponent } from 'src/app/shared/listing/listing.component';
import { NgxEchartsModule } from 'ngx-echarts';

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
    ScatterComponent,
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
