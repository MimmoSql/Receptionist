import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class UtenteService {
  private baseUrl = 'http://localhost:5000';

  constructor(private http: HttpClient, private MatDialog : MatDialog) { }

  getUtenti(): Observable<any> {
    return this.http.get(`${this.baseUrl}/utenti`);
  }

  addUtente(utente: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/utenti`, utente);
  }

  deleteUtente(interno: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/utenti/interno/${interno}`);
  }
  
  updateUtente(utente: any, interno: string): Observable<void> {
    return this.http.put<any>(`${this.baseUrl}/utenti/interno/${interno}`, utente);
  }

  saveCallData(callData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/calls`, callData, { headers });
  }
}
