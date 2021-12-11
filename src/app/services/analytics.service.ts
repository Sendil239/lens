import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataService } from 'src/app/services/data.service';

@Injectable({
    providedIn: 'root'
})

export class AnalyticsService {

    constructor(private dataService: DataService) {
    }

    getPoiDistribution() {
        return this.dataService.get('/getPoiDistribution').pipe(
            map(
                (response: any) => {
                    return response;
                }
            )
        )
    }

    getCountryDistribution(){
        return this.dataService.get('/getCountryDistribution').pipe(
            map(
                (response: any) => {
                    return response;
                }
            )
        )
    }

    getLanguageDistribution(){
        return this.dataService.get('/getLanguageDistribution').pipe(
            map(
                (response: any) => {
                    return response;
                }
            )
        )
    }    

    getTimeSeriesData(){
        return this.dataService.get('/getTimeSeriesData').pipe(
            map(
                (response: any) => {
                    return response;
                }
            )
        )
    }

    getCountryTimeSeriesData(){
        return this.dataService.get('/getCountryTimeSeriesData').pipe(
            map(
                (response: any) => {
                    return response;
                }
            )
        )
    }

    getTopicsImportance(){
        return this.dataService.get('/getTopicsImportance').pipe(
            map(
                (response: any) => {
                    return response;
                }
            )
        )
    }

        
}