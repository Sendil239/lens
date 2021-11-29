import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl} from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  poiValue: string;
  countryValue: string;
  languageValue: string;

  constructor() { 

  }

  ngOnInit(): void {
    // this.resetFilters();
  }

  @ViewChild('matPoi') matPoi: MatSelect;
  @ViewChild('matCountry') matCountry: MatSelect;
  @ViewChild('matLanguage') matLanguage: MatSelect;

  pois = new FormControl();
  poisList: string[] = ['Narendra Modi', 'Shashi Tharoor', 'Donald Trump', 'Joe Biden'];

  countries = new FormControl();
  countryList: string[] = ['India', 'USA', 'Mexico'];

  languages = new FormControl();
  languagesList: string[] = ['English', 'हिन्दी', 'español'];
  panelOpenState = false;

  resetFilters(){
    // this.poiValue = ''
    // this.countryValue = ''
    // this.languageValue = ''
    this.matPoi.options.forEach((data: MatOption) => data.deselect());
    this.matCountry.options.forEach((data: MatOption) => data.deselect());
    this.matLanguage.options.forEach((data: MatOption) => data.deselect());
  }

  clearFilters(){
    this.resetFilters();
  }

}
