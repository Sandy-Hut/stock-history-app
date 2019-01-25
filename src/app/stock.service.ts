import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { tap, map, catchError } from 'rxjs/operators'

import { Data } from '../app/data'

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiToken = 'aBK8z9krRtKmj9jbU7j5xpDglQNaQ9Ap0IJXeo1ISSctiWpi8Xz9Mr3TWggW';
  private sortBy = 'newest';
  private _url = 'https://www.worldtradingdata.com/api/v1/history?'
  constructor(private http: HttpClient) { }
  getData(fromDate,toDate,symbol): Observable<Data[]> {
    return this.http.get<Data[]>(`${this._url}symbol=${symbol}&sort=${this.sortBy}&date_from=${fromDate}&date_to=${toDate}&api_token=${this.apiToken}`).pipe(
      tap(data => JSON.stringify(data)),
      catchError(this.handleError)
    );
  }
  handleError(err:HttpErrorResponse){
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
