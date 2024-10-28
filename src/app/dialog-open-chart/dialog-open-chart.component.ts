import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dialog-open-chart',
  templateUrl: './dialog-open-chart.component.html',
  styleUrls: ['./dialog-open-chart.component.css'] // Corretto "styleUrl" in "styleUrls"
})
export class DialogOpenChartComponent implements OnInit {
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { pieChartData: number[], totalCalls: number },
    private dialogRef: MatDialogRef<DialogOpenChartComponent> // Aggiunto per gestire il dialogo
  ) {}

  ngOnInit(): void {
    this.createPieChart();
  }
 
  createPieChart(): void {
    const uniqueData = this.getUniqueData(this.data.pieChartData);
    const ctx = document.getElementById('pieChartCanvas') as HTMLCanvasElement;

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Chiamate riuscite', 'Chiamate non riuscite', 'Chiamate registrate', 'Chiamate non registrate'],
        datasets: [{
          label: 'Statistiche chiamate',
          data: uniqueData,
          backgroundColor: ['#00FF00', '#FF0000','#FFFF00','#000000']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Assicurati che il grafico occupi tutto lo spazio disponibile
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const item = tooltipItem;
                const label = item.label || '';
                const value = item.raw as number;
                return `${label}: ${value} (${((value / this.data.totalCalls) * 100).toFixed(2)}%)`;
              }
            }
          }
        }
      }
    });
  }
 
  getUniqueData(data: number[]): number[] {
    const seen = new Set();
    return data.filter(item => {
      if (seen.has(item)) {
        return false;
      } else {
        seen.add(item);
        return true;
      }
    });
  }

  closeDialog(): void {
    this.dialogRef.close(); // Chiude il dialogo
  }
}
