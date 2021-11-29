import { Injectable } from '@angular/core';
import { stringify } from 'querystring';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataService } from 'src/app/shared/data.service';

@Injectable({
    providedIn: 'root'
})

export class AnalyticsService {
    protected baseUrl = 'http://backend_url';

    constructor(private service: DataService) {
    }

        
}