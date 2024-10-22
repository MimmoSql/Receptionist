import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChartDataset, ChartOptions } from 'chart.js'; 
import moment from 'moment';

type ViewMode = 'monthly' | 'daily';

@Component({
  selector: 'app-recall-statistica',
  templateUrl: './recall-statistica.component.html',
  styleUrls: ['./recall-statistica.component.css']
})
export class RecallStatisticaComponent {
  barChartData: ChartDataset<'bar'>[] = [
    {
      data: [10000, 2, 3, 4, 5, 6], // Sostituisci con i tuoi dati reali
      label: 'Totale chiamate giornaliere',
      backgroundColor: '#007BFF', // Colore blu per le barre
      borderColor: '#0056b3', // Colore del bordo delle barre, opzionale
      borderWidth: 1 // Spessore del bordo, opzionale
    }
  ];
  
  barChartLabels: string[] = [];
  allCalls: any[] = [];
  viewMode: ViewMode = 'monthly'; // Imposta il valore iniziale
  showChartPopup: boolean = false; // Controlla se il popup è visibile

  // Definizione delle opzioni del grafico
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#000',
          font: {
            size: 24
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          }
        },
        backgroundColor: 'rgba(255, 255, 255, 1)',
        titleColor: '#000000',
        bodyColor: '#0000FF',
        borderColor: '#007BFF',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: '#e0e0e0'
        },
        ticks: {
          font: {
            size: 12,
            family: 'Arial',
            weight: 'bold'
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#e0e0e0'
        },
        ticks: {
          font: {
            size: 12,
            family: 'Arial',
            weight: 'bold'
          }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutBounce'
    },
    onClick: (event, elements) => {
      if (elements.length) {
        const index = elements[0].index;
        const label = this.barChartLabels[index];
        if (this.viewMode === 'monthly') {
          this.showDailyData(label);
        }
      }
    }
  };

  barChartLegend = true;
  barChartType: 'bar' = 'bar';

  constructor(@Inject(MAT_DIALOG_DATA) public data: { barChartData: ChartDataset<'bar'>[], barChartLabels: string[], allCalls: any[] }) {
    this.allCalls = data.allCalls; // Memorizza tutte le chiamate
    this.updateMonthlyData(); // Inizializza con i dati mensili
  }

  // Funzione per aggiornare i dati mensili
  updateMonthlyData() {
    const callsByMonth: { [month: string]: number } = {};

    this.allCalls.forEach(call => {
      const month = moment(call.setupTime).format('MMMM YYYY');
      if (!callsByMonth[month]) {
        callsByMonth[month] = 0;
      }
      callsByMonth[month]++;
    });

    this.barChartLabels = Object.keys(callsByMonth);
    this.barChartData = [
      { data: Object.values(callsByMonth), label: 'Totale chiamate per mese' }
    ];
    this.viewMode = 'monthly'; // Assicurati che la vista sia mensile

    this.openChartPopup(); // Mostra il popup
  }

  // Funzione per visualizzare i dati giornalieri
  showDailyData(month: string) {
    const callsByDay: { [day: string]: number } = {};

    this.allCalls.forEach(call => {
      if (moment(call.setupTime).format('MMMM YYYY') === month) {
        const day = moment(call.setupTime).format('D MMM YYYY');
        if (!callsByDay[day]) {
          callsByDay[day] = 0;
        }
        callsByDay[day]++;
      }
    });

    this.barChartLabels = Object.keys(callsByDay);
    this.barChartData = [
      { data: Object.values(callsByDay), label: `Totale chiamate per giorno in ${month}` }
    ];
    this.viewMode = 'daily'; // Cambia modalità di visualizzazione
  }

  // Funzione per tornare alla vista mensile
  backToMonthly() {
    this.updateMonthlyData(); // Aggiorna i dati per la vista mensile
  }

  // Funzione per aprire il popup
  openChartPopup() {
    this.showChartPopup = true; // Mostra il popup
  }

  // Funzione per chiudere il popup
  closeChartPopup() {
    this.showChartPopup = false; // Nascondi il popup
  }
  
}
