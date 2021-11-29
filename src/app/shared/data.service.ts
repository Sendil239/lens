import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable({
    providedIn: 'root'
})
export class DataService {
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
            .get(url, {
                headers,
                params,
                responseType
            })
            .pipe(catchError(this.handleError));
    }

    public post(body: Object, url: string, params?: any, responseType?: any): Observable<any> {
        const headers = this.setRequestheaders();
        return this._httpClient
            .post(url, body, {
                headers,
                params,
                responseType
            })
            .pipe(catchError(this.handleError));
    }

    public put(body: Object, url: string): Observable<any> {
        const headers = this.setRequestheaders();
        return this._httpClient
            .put(url, body, { headers })
            .pipe(catchError(this.handleError));
    }

    public delete(url: string): Observable<any> {
        const headers = this.setRequestheaders();
        return this._httpClient
            .delete(url, { headers })
            .pipe(catchError(this.handleError));
    }

    private handleError(error: any) {
        return throwError(() => new Error(error));
    }
}
