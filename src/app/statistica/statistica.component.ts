import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import moment from 'moment';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-statistica',
  templateUrl: './statistica.component.html',
  styleUrls: ['./statistica.component.css']
})
export class StatisticaComponent implements OnInit {
  apiBaseUrl: string = 'http://localhost:5000'; // Base URL del tuo backend Flask
  audioCodesApiUrl: string = 'https://livehub.audiocodes.io/api/v1/calls';
  chart: any; // Variabile per memorizzare il grafico
  lastCallDate: string = ''; // Data dell'ultima chiamata salvata
  currentDate: string = ''; // Data corrente in formato 'YYYY-MM-DD'
  token: string = ''; // Token di autenticazione da gestire
  allCalls: any[] = []; // Memorizza tutte le chiamate caricate
  loading: boolean = false; // Stato di caricamento delle chiamate

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.currentDate = moment().format('YYYY-MM-DD'); // Ottieni la data corrente
    this.getLastCallDate(); // Avvia il processo di recupero della data dell'ultima chiamata e aggiornamento del database
  }

  // 1. Prendere la data dell'ultima chiamata salvata dal database
  getLastCallDate(): void {
    this.http.get<any>(`${this.apiBaseUrl}/calls/last`).subscribe(
      (response) => {
        this.lastCallDate = response.lastCallDate || this.currentDate; // Usa la data corrente se nessuna data è salvata
        console.log(response)
        this.loadMoreCalls(); // Avvia il processo di caricamento delle chiamate
      },
      (error) => {
        console.error('Errore nel recupero dell\'ultima chiamata:', error);
      }
    );
  }

  // 2. Carica le chiamate dalla data dell'ultima chiamata salvata fino ad oggi e aggiungile al DB
  async loadMoreCalls(): Promise<void> {
    if (this.loading) return; // Evita chiamate multiple durante il caricamento
    this.loading = true;

    try {
      const token = await this.getToken(); // Recupera il token di autenticazione
      if (!token) {
        console.error('Token non disponibile.');
        return;
      }
      this.token = token;

      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.token}`
      });

      let startDate = this.lastCallDate;
      const endDate = this.currentDate; // Fino ad oggi

      const url = `https://livehub.audiocodes.io/api/v1/calls?sort=-setupTime&filter=(setupTime%3E%3D${startDate}%2CsetupTime%3C${endDate})`;

      const response = await this.http.get<{ calls: any[] }>(url, { headers }).toPromise();

      if (response?.calls) {
        this.allCalls = response.calls; // Salva le chiamate ottenute

        // 2.1 Aggiungi le chiamate al DB backend
        this.addCallsToDatabase(this.allCalls);
      } else {
        console.error('API non ha restituito chiamate.');
      }
    } catch (error) {
      console.error('Errore nella richiesta API:', error);
    } finally {
      this.loading = false;
    }
  }

  // 2.2 Aggiungi chiamate al database
  addCallsToDatabase(calls: any[]): void {
    this.http.post(`${this.apiBaseUrl}/add-calls`, { calls }).subscribe(
      (response) => {
        console.log('Chiamate aggiunte al DB con successo:', response);
        this.generateChart(); // 3. Genera i grafici con i dati aggiornati
      },
      (error) => {
        console.error('Errore durante l\'aggiunta delle chiamate al DB:', error);
      }
    );
  }

  // 3. Genera i grafici con i dati dal DB
  generateChart(): void {
    this.http.get(`${this.apiBaseUrl}/calls-data`).subscribe(
      (data: any) => {
        // Genera il grafico usando Chart.js
        this.chart = new Chart('chartCanvas', {
          type: 'line',
          data: {
            labels: data.labels,
            datasets: [{
              label: 'Numero di chiamate',
              data: data.callCounts,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      },
      (error) => {
        console.error('Errore nel recupero dei dati per il grafico:', error);
      }
    );
  }

  // Funzione per ottenere il token
  async getToken(): Promise<string | undefined> {
    const data = {
      grant_type: 'client_credentials',
      client_id: '858f4678-29a9-440b-9468-c30875f5a9ce', // Inserisci i dettagli corretti
      client_secret: '5HO8N2XPDVGA5B4GQPP96JCG0KLL7S7A2BU4M0B804HI219WJAXCWYHVH0MEH3WH' // Inserisci il secret corretto
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    try {
      const response = await this.http.post<{ token: string }>('https://livehub.audiocodes.io/oauth/token', data, { headers }).toPromise();
      return response?.token;
    } catch (error) {
      console.error('Errore nella richiesta del token:', error);
      return undefined;
    }
  }
}
