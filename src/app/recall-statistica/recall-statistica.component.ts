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

  // Definizione dell'opzione del grafico principale (mensile/giornaliero)
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
      data: [] as string[],
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
        data: [] as number[],
        itemStyle: {
          color: '#007BFF'
        }
      }
    ]
  };

  // Definizione dell'opzione per il grafico di dettaglio
  detailChartData: EChartsOption = {
    tooltip: {
      trigger: 'item'
    },
    xAxis: {
      type: 'category',
      data: [] as string[],
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
        name: 'Dettagli chiamate',
        type: 'line',
        data: [] as number[],
        itemStyle: {
          color: '#FF5733'
        }
      }
    ]
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: { allCalls: any[] }) {
    this.allCalls = data.allCalls; // Memorizza tutte le chiamate
    this.updateMonthlyData(); // Inizializza con i dati mensili
  }

  // Funzione per aggiornare i dati mensili (grafico principale e dettaglio)
  updateMonthlyData() {
    const callsByMonth: { [month: string]: number } = {};
    const detailData: { [month: string]: number } = {}; // Dati per il grafico di dettaglio

    this.allCalls.forEach(call => {
      const month = moment(call.setupTime).format('MMMM YYYY');
      if (!callsByMonth[month]) {
        callsByMonth[month] = 0;
        detailData[month] = Math.floor(Math.random() * 50); // Dati casuali per esempio
      }
      callsByMonth[month]++;
    });

    const xAxisData = Object.keys(callsByMonth);
    const seriesData = Object.values(callsByMonth);
    const detailSeriesData = Object.values(detailData);

    // Aggiorna dati per il grafico principale
    if (this.barChartData.xAxis && typeof this.barChartData.xAxis === 'object') {
      (this.barChartData.xAxis as { data: string[] }).data = xAxisData;
    }
    if (this.barChartData.series && Array.isArray(this.barChartData.series)) {
      (this.barChartData.series[0] as { data: number[] }).data = seriesData;
    }

    // Aggiorna dati per il grafico di dettaglio
    if (this.detailChartData.xAxis && typeof this.detailChartData.xAxis === 'object') {
      (this.detailChartData.xAxis as { data: string[] }).data = xAxisData;
    }
    if (this.detailChartData.series && Array.isArray(this.detailChartData.series)) {
      (this.detailChartData.series[0] as { data: number[] }).data = detailSeriesData;
    }

    this.viewMode = 'monthly'; // Assicurati che la vista sia mensile
  }

  // Funzione per visualizzare i dati giornalieri (grafico principale e dettaglio)
  showDailyData(month: string) {
    const callsByDay: { [day: string]: number } = {};
    const detailData: { [day: string]: number } = {}; // Dati per il grafico di dettaglio

    this.allCalls.forEach(call => {
      if (moment(call.setupTime).format('MMMM YYYY') === month) {
        const day = moment(call.setupTime).format('D MMM YYYY');
        if (!callsByDay[day]) {
          callsByDay[day] = 0;
          detailData[day] = Math.floor(Math.random() * 20); // Dati casuali per esempio
        }
        callsByDay[day]++;
      }
    });

    const xAxisData = Object.keys(callsByDay);
    const seriesData = Object.values(callsByDay);
    const detailSeriesData = Object.values(detailData);

    // Aggiorna dati per il grafico principale
    if (this.barChartData.xAxis && typeof this.barChartData.xAxis === 'object') {
      (this.barChartData.xAxis as { data: string[] }).data = xAxisData;
    }
    if (this.barChartData.series && Array.isArray(this.barChartData.series)) {
      (this.barChartData.series[0] as { data: number[] }).data = seriesData;
    }

    // Aggiorna dati per il grafico di dettaglio
    if (this.detailChartData.xAxis && typeof this.detailChartData.xAxis === 'object') {
      (this.detailChartData.xAxis as { data: string[] }).data = xAxisData;
    }
    if (this.detailChartData.series && Array.isArray(this.detailChartData.series)) {
      (this.detailChartData.series[0] as { data: number[] }).data = detailSeriesData;
    }

    this.viewMode = 'daily'; // Cambia modalità di visualizzazione
  }

  // Funzione per tornare alla vista mensile
  backToMonthly() {
    this.updateMonthlyData(); // Aggiorna i dati per la vista mensile
  }
}
