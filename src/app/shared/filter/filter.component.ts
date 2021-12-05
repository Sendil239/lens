import { Component, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { IFilter } from '../interfaces/filter.interface';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  
  selectedPois: any;
  selectedCountries: any;
  selectedLanguages: any;
  showFiller: boolean;
  appliedFilter: any;

  constructor() { 
    this.selectedPois = new FormControl();
    this.selectedCountries = new FormControl();
    this.selectedLanguages = new FormControl();
    this.showFiller= false;
    this.appliedFilter = [];
  }

  ngOnInit(): void {
  }

  @ViewChild('matPoi') matPoi: MatSelect;
  @ViewChild('matCountry') matCountry: MatSelect;
  @ViewChild('matLanguage') matLanguage: MatSelect;

  panelOpenState = false;

  @Input('filterData')
  filterData: IFilter;

  @Output() filterApplied = new EventEmitter();

  resetFilters(){
    this.matPoi.options.forEach((data: MatOption) => data.deselect());
    this.matCountry.options.forEach((data: MatOption) => data.deselect());
    this.matLanguage.options.forEach((data: MatOption) => data.deselect());
    this.appliedFilter = [];
  }

  clearFilters(){
    this.resetFilters();
    this.applyFilter();
  }

  applyFilter(){
    const selectedFilter: any = {
      selectedPois: this.selectedPois.value ? this.selectedPois.value : [],
      selectedCountries: this.selectedCountries.value ? this.selectedCountries.value : [],
      selectedLanguages: this.selectedLanguages.value ? this.selectedLanguages.value : []
    };
    this.createFilterChip(this.selectedPois.value, this.selectedCountries.value, this.selectedLanguages.value);
    this.filterApplied.emit(selectedFilter);
  }

  createFilterChip(poiList: string[], countryList: string[], languageList: string[]){
    this.appliedFilter = [];
    if(poiList?.length > 0){
      const obj = {key: 0, text: `POIs: ${poiList.toString()}`};
      this.appliedFilter.push(obj);
    }
    if(countryList?.length > 0){
      const obj = {key: 1, text: `Country: ${countryList.toString()}`};
      this.appliedFilter.push(obj);
    }
    if(languageList?.length > 0){
      const obj = {key: 2, text: `Language: ${languageList.toString()}`};
      this.appliedFilter.push(obj);
    }
  }

  removeFilterChip(keyValue: number){
    if(keyValue == 0){
      this.matPoi.options.forEach((data: MatOption) => data.deselect());
      this.appliedFilter = this.appliedFilter.filter((i: any) => i.key !== keyValue);
    }
    else if(keyValue == 1){
      this.matCountry.options.forEach((data: MatOption) => data.deselect());
      this.appliedFilter = this.appliedFilter.filter((i: any) => i.key !== keyValue);
    }
    else if(keyValue == 2){
      this.matLanguage.options.forEach((data: MatOption) => data.deselect());
      this.appliedFilter = this.appliedFilter.filter((i: any) => i.key !== keyValue);
    } 

  }

}
