import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MaterialModule } from '../app/modules/material/material.module'
import { LayoutComponent } from './components/layout/layout.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { WordcloudComponent } from './components/wordcloud/wordcloud.component';
import { UtilService } from 'src/app/services/util.service';
import { TimeseriesanalysisComponent } from './components/timeseriesanalysis/timeseriesanalysis.component';
import { LineComponent } from './components/visualizations/line/line.component';


@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    LoaderComponent,
    WordcloudComponent,
    TimeseriesanalysisComponent,
    LineComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [
    UtilService
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }