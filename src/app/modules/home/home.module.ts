import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// components
import { HomeComponent } from '../../components/home/home.component';
import { SharedModule } from '../shared/shared.module';
import { FilterComponent } from 'src/app/shared/filter/filter.component';
import { ListingComponent } from 'src/app/shared/listing/listing.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  }
];

@NgModule({
  declarations: [HomeComponent, 
    FilterComponent, 
    ListingComponent],
  imports: [SharedModule,
    RouterModule.forChild(routes)],
  exports: [HomeComponent]
})
export class HomeModule { }
