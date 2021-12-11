import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { DataService } from 'src/app/services/data.service';

@Injectable({
    providedIn: 'root'
})

export class HomeService {    

    constructor(private dataService: DataService) {

    }

    getFilterData() {
        return this.dataService.get('/getFilterData').pipe(
            map(
                (response: any) => {
                    return response;
                }
            )
        )
    }

    postFilterData(filterData: any) {
        return this.dataService.post(filterData, '/searchQuery').pipe(
            map(
                (response: any) => {
                    return response;
                }
            )
        )
    }
    
}