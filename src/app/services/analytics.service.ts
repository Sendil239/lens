import { Injectable } from '@angular/core';
import { stringify } from 'querystring';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataService } from 'src/app/services/data.service';

@Injectable({
    providedIn: 'root'
})

export class AnalyticsService {

    constructor(private service: DataService) {
    }

        
}