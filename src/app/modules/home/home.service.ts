import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { DataService } from 'src/app/shared/data.service';

@Injectable({
    providedIn: 'root'
})

export class HomeService {    

    constructor(private dataService: DataService) {

    }

    getPois() {
        return this.dataService.get('/getPoi').pipe(
            map(
                (response: any) => {
                    return response;
                }
            )
        )
    }

    postFilterData(searchTerm: string, filterData: any) {

    }
    
}