import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ChartDataset, ChartOptions } from 'chart.js';
import moment from 'moment';
import { DialogOpenChartComponent } from '../dialog-open-chart/dialog-open-chart.component';
import { RecallStatisticaComponent } from '../recall-statistica/recall-statistica.component';
import { UtenteService } from '../services/utente.service';


interface TokenResponse {
  token: string;
}

interface CallData {
  callId: string;
  callingEntity: {
    id: string;
    type: string;
    displayName: string;
    phoneNumber: string;
    isTeams: boolean;
    isClickToCall: boolean;
  };
  calledEntity: {
    id: string;
    type: string;
    displayName: string;
    phoneNumber: string;
    isTeams: boolean;
  };
  ingressCallingNumber: string;
  egressCalledNumber: string;
  setupTime: string;
  connectTime: string;
  endTime: string;
  successful: boolean;
  durationSeconds: number;
  terminationDescription: string;
  recorded: boolean;
  botConversationId: string;
  globalSessionId: string;
  alternativeRoute: string | undefined;
  features: string[];
}

@Component({
  selector: 'app-recall',
  templateUrl: './statistica.component.html',
  styleUrls: ['./statistica.component.css'],
})
export class StatisticaComponent implements OnInit, OnDestroy {
  allCalls: CallData[] = [];
  paginatedCalls: CallData[] = [];
  token: string | undefined;
  currentPage: number = 1;
  itemsPerPage: number = 100;
  totalPages: number = 1;
  selectedDate: string = '';
  agentNameFilter: string = '';
  uniqueCallIds = new Set<string>();

  pieChartData: number[] = [0, 0, 0, 0];
  barChartData: ChartDataset<'bar'>[] = [{ data: [], label: 'Totale chiamate giornaliere' }];
  barChartLabels: string[] = [];

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
  };
  barChartLegend = true;
  barChartType: 'bar' = 'bar';
  
  private updateInterval: any;

  constructor(private http: HttpClient, private dialog: MatDialog, private UtenteService: UtenteService) {}

  ngOnInit(): void {
    this.startUpdatingCalls();
  }

  ngOnDestroy(): void {
    clearInterval(this.updateInterval);
  }

  startUpdatingCalls(): void {
    this.getCallsData(); // Esegui una chiamata API subito
    this.updateInterval = setInterval(() => {
      this.getCallsData();
    }, 500000); // Aggiorna ogni 5 min
  }

  getToken(): Observable<string> {
    const data = {
      grant_type: 'client_credentials',
      client_id: '858f4678-29a9-440b-9468-c30875f5a9ce',
      client_secret: '5HO8N2XPDVGA5B4GQPP96JCG0KLL7S7A2BU4M0B804HI219WJAXCWYHVH0MEH3WH'
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<TokenResponse>('https://livehub.audiocodes.io/oauth/token', data, { headers }).pipe(
      map(response => response.token),
      catchError(error => {
        console.error('Errore nella richiesta del token:', error);
        throw error;
      })
    );
  }

  async getCallsData() {
    try {
      // Richiedi un nuovo token
      const token = await this.getToken().toPromise();
      if (!token) {
        throw new Error('Token non disponibile');
      }
      this.token = token;
  
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      });
  
      let currentDate = moment('2024-04-01'); // Data di inizio
      const today = moment(); // Data crrente
  
      while (currentDate.isBefore(today)) {
        const startDate = currentDate.format('YYYY-MM-DD');
        const endDate = currentDate.clone().add(1, 'day').format('YYYY-MM-DD');
  
        let page = 1;
        const limit = 1000;
        let hasMoreData = true;
  
        while (hasMoreData) {
          const url = `https://livehub.audiocodes.io/api/v1/calls?sort=-setupTime&filter=(setupTime%3E%3D${startDate}%2CsetupTime%3C${endDate})&page=${page}&limit=${limit}`;
          try {
            const response = await this.http.get<{ calls: CallData[] }>(url, { headers }).toPromise();
            console.log('API Response:', response);
  
            if (response && response.calls) {
              const newCalls = response.calls.filter(call => {
                const calledEntityDisplayName = call.calledEntity.displayName;
                return calledEntityDisplayName && calledEntityDisplayName.toLowerCase().includes('agent-no-2');
              }).filter(call => !this.uniqueCallIds.has(call.callId)); 
  
              for (const call of newCalls) {
                try {
                  await this.UtenteService.saveCallData(this.transformCallData(call)).toPromise();
                  this.uniqueCallIds.add(call.callId); // Aggiungi l'ID chiamata al Set
                } catch (error) {
                  console.error('Errore nel salvataggio della chiamata:', call.callId, error);
                }
              }
  
              this.allCalls = [...this.allCalls, ...newCalls];
              console.log('All Calls:', JSON.stringify(this.allCalls, null, 2));
  
              if (response.calls.length < limit) {
                hasMoreData = false;
              } else {
                page++;
              }
            } else {
              throw new Error('Nessun dato ricevuto');
            }
          } catch (apiError) {
            console.error('Errore nella richiesta API:', 'URL:', url);
            hasMoreData = false; // Esci dal ciclo in caso di errore API
          }
        }
  
        currentDate.add(1, 'day'); // Incrementa la data di un giorno
      }
  
      this.totalPages = Math.ceil(this.allCalls.length / this.itemsPerPage);
      this.updatePaginatedCalls();
    } catch (error) {
      console.error('Errore nella richiesta dei dati delle chiamate:', error);
    }
  }
  
  transformCallData(call: CallData): any {
    return {
      "callId": call.callId,
      "calling_entity_display_name": call.callingEntity.displayName,
      "calling_entity_id": call.callingEntity.id,
      "calling_entity_phone_number": call.callingEntity.phoneNumber,
      "calling_entity_type": call.callingEntity.type,
      "called_entity_display_name": call.calledEntity.displayName,
      "called_entity_id": call.calledEntity.id,
      "called_entity_phone_number": call.calledEntity.phoneNumber,
      "called_entity_type": call.calledEntity.type,
      "alternative_route": call.alternativeRoute,
      "connect_time": call.connectTime,
      "duration_seconds": call.durationSeconds,
      "egress_called_number": call.egressCalledNumber,
      "features": call.features,
      "global_session_id": call.globalSessionId,
      "ingress_calling_number": call.ingressCallingNumber,
      "setup_time": call.setupTime,
      "successful": call.successful,
      "termination_description": call.terminationDescription,
      "recorded": call.recorded,
      "bot_conversation_id": call.botConversationId
    };
  }

  saveCallData(call: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post('/calls', call, { headers }).pipe(
      catchError(error => {
        console.error('Errore durante il salvataggio dei dati della chiamata:', error);
        throw error;
      })
    );
  }

  updatePaginatedCalls() {
    if (!this.selectedDate) {
      // Applica il filtro del nome dell'agente se specificato
      const filteredCalls = this.agentNameFilter 
        ? this.allCalls.filter(call => call.calledEntity.displayName.toLowerCase().includes(this.agentNameFilter.toLowerCase()))
        : this.allCalls;

      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      this.paginatedCalls = filteredCalls.slice(startIndex, startIndex + this.itemsPerPage);
    } else {
      const selectedDate = new Date(this.selectedDate);
      this.paginatedCalls = this.allCalls.filter(call => {
        const callDate = new Date(call.setupTime);
        return callDate.toDateString() === selectedDate.toDateString();
      }).slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
    }
  }

  onDateChange(newDate: string) {
    this.selectedDate = newDate;
    this.updatePaginatedCalls();
  }

  onAgentNameFilterChange(newFilter: string) {
    this.agentNameFilter = newFilter;
    this.updatePaginatedCalls();
  }

  updatePieChartData() {
    // Filtra le chiamate per ottenere solo quelle con callId unici
    const uniqueCalls = this.filterUniqueCalls(this.allCalls);
  
    // Filtra le chiamate che sono state passate a RecallStatisticaComponent
    const callsByDate: { [date: string]: number } = {};
    
    uniqueCalls.forEach(call => {
      const date = moment(call.setupTime).format('D MMM YY');
      if (!callsByDate[date]) {
        callsByDate[date] = 0;
      }
      callsByDate[date]++;
    });
  
    // Ora usa i dati filtrati per il grafico a torta
    const totalCalls = uniqueCalls.length;
    const successfulCalls = uniqueCalls.filter(call => call.successful).length;
    const unsuccessfulCalls = totalCalls - successfulCalls;
    const recordedCalls = uniqueCalls.filter(call => call.recorded).length;
    const notRecordedCalls = totalCalls - recordedCalls;
  
    this.pieChartData = [
      successfulCalls,
      unsuccessfulCalls,
      recordedCalls,
      notRecordedCalls
    ];
  
    this.dialog.open(DialogOpenChartComponent, {
      data: {
        pieChartData: this.pieChartData,
        totalCalls: totalCalls
      }
    });
  }
  

  updateBarChartData() {
    // Filtra le chiamate per ottenere solo quelle con callId unici
    const uniqueCalls = this.filterUniqueCalls(this.allCalls);
  
    const callsByDate: { [date: string]: number } = {};
  
    uniqueCalls.forEach(call => {
      const date = moment(call.setupTime).format('D MMM YY');
      if (!callsByDate[date]) {
        callsByDate[date] = 0;
      }
      callsByDate[date]++;
    });
  
    this.barChartLabels = Object.keys(callsByDate);
    this.barChartData = [
      { data: Object.values(callsByDate), label: 'Totale chiamate per giorno' }
    ];
  
    this.dialog.open(RecallStatisticaComponent, {
      data: {
        barChartData: this.barChartData,
        barChartLabels: this.barChartLabels,
        allCalls: this.allCalls
      }
    });
  }
  
  updateMonthlyBarChartData() {
    const uniqueCalls = this.filterUniqueCalls(this.allCalls);
    const callsByMonth: { [month: string]: number } = {};
  
    uniqueCalls.forEach(call => {
      const month = moment(call.setupTime).format('MMM YYYY');
      if (!callsByMonth[month]) {
        callsByMonth[month] = 0;
      }
      callsByMonth[month]++;
    });
  
    this.barChartLabels = Object.keys(callsByMonth);
    this.barChartData = [
      { data: Object.values(callsByMonth), label: 'Totale chiamate mensili' }
    ];
  
    this.dialog.open(RecallStatisticaComponent, {
      data: {
        barChartData: this.barChartData,
        barChartLabels: this.barChartLabels,
        allCalls: this.allCalls
      }
    });
  }
  
  // Funzione per filtrare le chiamate uniche
  filterUniqueCalls(calls: CallData[]): CallData[] {
    const uniqueCallIds = new Set<string>();
    return calls.filter(call => {
      if (!uniqueCallIds.has(call.callId)) {
        uniqueCallIds.add(call.callId);
        return true;
      }
      return false;
    });
  }
  


  showDailyData(month: string) {
    const uniqueCalls = this.filterUniqueCalls(this.allCalls);
    const callsByDay: { [day: string]: number } = {};
    const startDate = moment(month, 'MMM YYYY').startOf('month');
    const endDate = moment(month, 'MMM YYYY').endOf('month');

    uniqueCalls.forEach(call => {
      const callDate = moment(call.setupTime);
      if (callDate.isBetween(startDate, endDate, 'day', '[]')) {
        const day = callDate.format('D MMM YYYY');
        if (!callsByDay[day]) {
          callsByDay[day] = 0;
        }
        callsByDay[day]++;
      }
    });

    this.barChartLabels = Object.keys(callsByDay);
    this.barChartData = [
      { data: Object.values(callsByDay), label: 'Totale chiamate giornaliere' }
    ];

    this.dialog.open(RecallStatisticaComponent, {
      data: {
        barChartData: this.barChartData,
        barChartLabels: this.barChartLabels
      }
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedCalls();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedCalls();
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedCalls();
    }
  }

  onPageClick(event: Event, page: number) {
    event.preventDefault();
    this.goToPage(page);
  }
}
