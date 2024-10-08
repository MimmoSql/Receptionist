import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ChiamateService {

  private apiUrl = 'http://localhost:5000';  // Cambia l'URL secondo il tuo backend

  constructor(private http: HttpClient) { }

  // Metodo per ottenere le chiamate dal database
  getCalls(page: number, limit: number, searchQuery: string): Observable<any> {
    const url = `${this.apiUrl}?page=${page}&limit=${limit}&search=${searchQuery}`;
    return this.http.get<any>(url).pipe(
      catchError(this.handleError<any>('getCalls', []))
    );
  }

  // Metodo per ottenere le chiamate dal database
  getCalls2(page: number, limit: number, searchQuery: string): Observable<any> {
    const url = `${this.apiUrl}/calls?page=${page}&limit=${limit}&search=${searchQuery}`;
    return this.http.get<any>(url).pipe(
      catchError(this.handleError<any>('getCalls', []))
    );
  }


  // Metodo per gestire gli errori
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  

}
