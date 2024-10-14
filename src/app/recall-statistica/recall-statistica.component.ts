import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as echarts from 'echarts';
import moment from 'moment';
import { EChartsOption } from 'echarts';

type ViewMode = 'monthly' | 'daily';

@Component({
  selector: 'app-recall-statistica',
  templateUrl: './recall-statistica.component.html',
  styleUrls: ['./recall-statistica.component.css']
})
export class RecallStatisticaComponent {
  viewMode: ViewMode = 'monthly'; // Imposta il valore iniziale
  allCalls: any[] = [];

  // Definizione dell'opzione del grafico
  barChartData: EChartsOption = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: {
        color: '#000'
      }
    },
    xAxis: {
      type: 'category',
      data: [] as string[], // Dichiariamo data come array di stringhe
      axisLabel: {
        color: '#000'
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#000'
      }
    },
    series: [
      {
        name: 'Totale chiamate',
        type: 'bar',
        data: [] as number[], // Dichiariamo data come array di numeri
        itemStyle: {
          color: '#007BFF'
        }
      }
    ]
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: { allCalls: any[] }) {
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

    // Assicuriamoci che xAxis.data sia un array di stringhe
    const xAxisData = Object.keys(callsByMonth);
    const seriesData = Object.values(callsByMonth);

    if (this.barChartData.xAxis && typeof this.barChartData.xAxis === 'object') {
      (this.barChartData.xAxis as { data: string[] }).data = xAxisData; // Type assertion
    }
    if (this.barChartData.series && Array.isArray(this.barChartData.series)) {
      (this.barChartData.series[0] as { data: number[] }).data = seriesData; // Type assertion
    }

    this.viewMode = 'monthly'; // Assicurati che la vista sia mensile
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

    // Assicuriamoci che xAxis.data sia un array di stringhe
    const xAxisData = Object.keys(callsByDay);
    const seriesData = Object.values(callsByDay);

    if (this.barChartData.xAxis && typeof this.barChartData.xAxis === 'object') {
      (this.barChartData.xAxis as { data: string[] }).data = xAxisData; // Type assertion
    }
    if (this.barChartData.series && Array.isArray(this.barChartData.series)) {
      (this.barChartData.series[0] as { data: number[] }).data = seriesData; // Type assertion
    }

    this.viewMode = 'daily'; // Cambia modalità di visualizzazione
  }

  // Funzione per tornare alla vista mensile
  backToMonthly() {
    this.updateMonthlyData(); // Aggiorna i dati per la vista mensile
  }
}
