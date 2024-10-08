import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';

interface CallData {
  callId: string;
  callingEntity: {
    id: string;
    displayName: string;
    phoneNumber: string;
  };
  calledEntity: {
    id: string;
    displayName: string;
    phoneNumber: string;
  };
  setupTime: string;
  durationSeconds: number;
  successful: boolean;
  connectTime: string;
}

@Component({
  selector: 'app-chiamate',
  templateUrl: './chiamate.component.html',
  styleUrls: ['./chiamate.component.css']
})
export class ChiamateComponent implements OnInit, OnDestroy {
  allCalls: CallData[] = [];
  filteredCalls: CallData[] = [];
  loading = false;
  token: string | undefined;
  currentDate = moment(); // Usato per il caricamento predefinito
  selectedDate: string = ''; // Data selezionata dall'utente
  searchTerm: string = '';
  statusFilter: string = ''; // Nuovo filtro per lo stato della chiamata

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadMoreCalls(); // Carica inizialmente con la data corrente
  }

  ngOnDestroy(): void {}

  async getToken(): Promise<string | undefined> {
    const data = {
      grant_type: 'client_credentials',
      client_id: '858f4678-29a9-440b-9468-c30875f5a9ce',
      client_secret: '5HO8N2XPDVGA5B4GQPP96JCG0KLL7S7A2BU4M0B804HI219WJAXCWYHVH0MEH3WH'
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

  async loadMoreCalls(): Promise<void> {
    if (this.loading) return;

    this.loading = true;

    try {
      const token = await this.getToken();
      if (!token) {
        console.error('Token non disponibile.');
        return;
      }
      this.token = token;

      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.token}`
      });

      let startDate: string;
      let endDate: string;

      // Se l'utente ha selezionato una data, usala, altrimenti usa la data corrente.
      if (this.selectedDate) {
        startDate = this.selectedDate;
        endDate = moment(startDate).clone().add(1, 'day').format('YYYY-MM-DD');
      } else {
        startDate = this.currentDate.format('YYYY-MM-DD');
        endDate = this.currentDate.clone().add(1, 'day').format('YYYY-MM-DD');
      }

      const url = `https://livehub.audiocodes.io/api/v1/calls?sort=-setupTime&filter=(setupTime%3E%3D${startDate}%2CsetupTime%3C${endDate})`;

      const response = await this.http.get<{ calls: CallData[] }>(url, { headers }).toPromise();

      if (response?.calls) {
        const filteredCalls = response.calls.filter(call => call.calledEntity.displayName === 'agent-no-2');
        this.allCalls = [...this.allCalls, ...filteredCalls];
        this.filterCalls(); // Filtra immediatamente dopo aver caricato nuove chiamate
      } else {
        console.error('API returned null or no "calls" field.');
      }

      if (!this.selectedDate) {
        // Se non è stata selezionata una data, continua a scorrere indietro nel tempo
        this.currentDate.subtract(1, 'day');
      }

    } catch (error) {
      console.error('Errore nella richiesta API:', error);
    } finally {
      this.loading = false;
    }
  }

  // Funzione che viene chiamata quando l'utente seleziona una data
  onDateChange(): void {
    this.allCalls = [];  // Resetta la lista delle chiamate per caricare solo quelle della data selezionata
    this.loadMoreCalls(); // Carica chiamate per la data selezionata
  }

  filterCalls(): void {
    let filtered = this.allCalls.filter(call => 
      call.calledEntity.displayName === 'agent-no-2'
      && (call.callingEntity.displayName.toLowerCase().includes(this.searchTerm.toLowerCase())
        || call.callingEntity.phoneNumber.includes(this.searchTerm)
        || call.calledEntity.displayName.toLowerCase().includes(this.searchTerm.toLowerCase())
        || call.calledEntity.phoneNumber.includes(this.searchTerm)
        || call.callId.includes(this.searchTerm))
    );

    if (this.statusFilter) {
      const successFilter = this.statusFilter === 'true';
      filtered = filtered.filter(call => call.successful === successFilter);
    }

    this.filteredCalls = filtered;
  }
}
