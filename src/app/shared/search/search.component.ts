import { Component, Output, EventEmitter, Input, ViewChild } from '@angular/core';

import {
    FormControl,
    FormGroupDirective,
    NgForm,
    Validators
} from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  isError: boolean = false;

  searchForm = new FormControl('', [Validators.required]);
  @ViewChild('formDirective', {static: false}) private formDirective: NgForm;
  
  @Output() searchButtonClicked = new EventEmitter();
  // send data to parent component and handle it from there
  searchKeyword() {
      if (this.searchForm.valid) {
          console.log(this.searchForm.value);
          // this.searchButtonClicked.emit(this.searchForm.value);
      }
  }

}
