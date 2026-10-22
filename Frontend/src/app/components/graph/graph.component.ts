import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { Chart, registerables } from 'chart.js';
import { GraphSettingsService } from '../../services/graph-settings.service';
import { Subscription } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './graph.component.html',
  styleUrl: './graph.component.css'
})
export class GraphComponent implements OnInit, OnDestroy {

  constructor(private settings: GraphSettingsService) { }

  private timer: any;

  chartData: ChartConfiguration<'line'>['data'] = {
    labels: [0],
    datasets: [
      {
        data: [], label: 'pH', borderColor: '#3b82f6', tension: 0.3, fill: true,
        backgroundColor: 'rgba(74, 144, 164, 0.2)'
      }
    ]
  };

  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    scales: {
      y: { min: 0, max: 14, title: { display: true, text: 'pH' } },
      x: { title: { display: true, text: 'seconds' } }
    },
    maintainAspectRatio: false,
    plugins: {
      title: { display: true, text: 'Live pH Reading' }
    }
  };

  private sub!: Subscription;

  reset() {
    this.labelNumber = 0;
    this.chartData = {
      labels: [0],
      datasets: [{ ...this.chartData.datasets[0], data: [] }]
    };
  }

  private labelNumber = 0;

  ngOnInit() {
    // CALL RESET FUNCTION WHEN STOP BUTTON IS PUSHED
    this.sub = this.settings.resetSignal.subscribe(() => this.reset());

    this.timer = setInterval(() => {

      if (this.settings.startButtonPressed) {
        // STOPS TEST WHEN DESIRED AMOUNT OF SECONDS IS REACHED
        if (this.labelNumber >= this.settings.testSeconds + 1) {
          return;
        }

        const ph = 7 + (Math.random() - 0.5) * 2; // around 6 to 8

        // ADDS 1 SECOND AND PUSHES 1 PH AMOUNT PER INTERVAL
        this.labelNumber += 1
        this.chartData.labels!.push(this.labelNumber);
        this.chartData.datasets[0].data.push(Number(ph.toFixed(2)));

        // SHIFTS CHART OVER WHEN THE AMOUNT OF IT REACHES HALF OF THE DISPLAYED SECONDS ON THE GRAPH
        while (this.chartData.labels!.length > this.settings.maxPoints) {
          this.chartData.labels!.shift();
          this.chartData.datasets[0].data.shift();
        }

        this.chartData = { ...this.chartData }; // redraw
      }
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
    this.sub.unsubscribe();
  }
}
