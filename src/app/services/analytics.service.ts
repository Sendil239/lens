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

    getCorpusChartData(){
        return this.dataService.get('/getCorpusChartData').pipe(
            map(
                (response: any) => {
                    return response;
                }
            )
        )
    }

    getWordCloudData(){
        return this.dataService.get('/getWordCloudData').pipe(
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
        
}