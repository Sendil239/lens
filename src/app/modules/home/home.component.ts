import { Component, OnInit } from '@angular/core';
import { IFilter } from 'src/app/shared/interfaces/filter.interface';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  filterData: IFilter;
  isLoading: boolean;

  constructor(private homeService: HomeService) {
    this.filterData = {
      countryList: [],
      languageList: [],
      poiList: []
    };
   }

  ngOnInit(): void {
    this.filterData.countryList = ['India', 'Mexico', 'USA'];
    this.filterData.languageList = ['English', 'Hindi', 'Spanish'];
    this.homeService.getPois()
      .subscribe(result => {
        this.isLoading = false;
        if(result){
          this.filterData.poiList = result.poi_names;
        }
      })
  }

}
