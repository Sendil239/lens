import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    protected baseUrl = 'http://192.168.1.164:9999';
    constructor(
        private _httpClient: HttpClient
    ) {}
    
    private setRequestheaders() {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
    }

    private setFileRequestheaders() {
        return new HttpHeaders({
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
    }

    public get(url: string, params?: any, responseType?: any): Observable<any> {
        const headers = this.setRequestheaders();
        return this._httpClient
            .get(this.baseUrl + url, {
                headers,
                params,
                responseType
            })
            .pipe(catchError(this.handleError));
    }

    public post(body: Object, url: string, params?: any, responseType?: any): Observable<any> {
        const headers = this.setRequestheaders();
        return this._httpClient
            .post(this.baseUrl + url, body, {
                headers,
                params,
                responseType
            })
            .pipe(catchError(this.handleError));
    }

    public put(body: Object, url: string): Observable<any> {
        const headers = this.setRequestheaders();
        return this._httpClient
            .put(this.baseUrl + url, body, { headers })
            .pipe(catchError(this.handleError));
    }

    public delete(url: string): Observable<any> {
        const headers = this.setRequestheaders();
        return this._httpClient
            .delete(this.baseUrl + url, { headers })
            .pipe(catchError(this.handleError));
    }

    private handleError(error: any) {  
        return throwError(() => new Error(error));
    }
}
