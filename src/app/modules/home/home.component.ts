import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { filter } from 'd3-array';
import { IFilter } from 'src/app/shared/interfaces/filter.interface';
import { ITwitterData } from 'src/app/shared/interfaces/twitter_data.interface';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  filterData: IFilter;
  isLoading: boolean;
  tweetsList: ITwitterData[];

  constructor(private homeService: HomeService) {
    this.filterData = {
      countryList: [],
      languageList: [],
      poiList: []
    };
    this.tweetsList = [];
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

  isError: boolean = false;

  searchForm = new FormControl('', [Validators.required]);
  @ViewChild('formDirective', {static: false}) private formDirective: NgForm;
    
  searchKeyword() {
      if (this.searchForm.valid) {
          this.applyFilter([]);
      }
  }

  applyFilter(filterParams: any) {
    if(this.checkIfValidSearch(filterParams)){
      const filterBody = {
        'query': this.searchForm.value,
        'poi_names': filterParams?.selectedPois ?? [],
        'countries': filterParams?.selectedCountries ?? [],
        'languages': filterParams?.selectedLanguages ?? []
      }
      this.homeService.postFilterData(filterBody)
      .subscribe((result:ITwitterData[]) =>{
        this.isLoading = false;
        if(result){
          this.tweetsList = result;
        }
      })
    }
  }

  checkIfValidSearch(filterParams: any){
    if(this.searchForm.value != '')
      return true;

    if(filterParams.selectedPois.length == 0 || filterParams.selectedCountries.length == 0 || filterParams.selectedLanguages.length == 0)
      return true;

    return false;
  }

  

}
