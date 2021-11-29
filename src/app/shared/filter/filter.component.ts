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

  constructor() { 
    this.selectedPois = new FormControl();
    this.selectedCountries = new FormControl();
    this.selectedLanguages = new FormControl();
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
    this.filterApplied.emit(selectedFilter);
  }

}
