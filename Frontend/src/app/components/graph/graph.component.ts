import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, Chart, registerables } from 'chart.js';
import { Subscription } from 'rxjs';
import { GraphSettingsService } from '../../services/graph-settings.service';
import { ReadingsService, Reading } from '../../services/readings.service';

Chart.register(...registerables);

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './graph.component.html',
  styleUrl: './graph.component.css'
})
export class GraphComponent implements OnInit, OnDestroy {
  @Input() meter = 1;

  private settings = inject(GraphSettingsService);
  private readingsService = inject(ReadingsService);
  private subs = new Subscription();

  private phByTime = new Map<number, number>();
  private latest = 0;

  chartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [], label: 'pH', borderColor: '#3b82f6', tension: 0.3, fill: true,
        backgroundColor: 'rgba(74, 144, 164, 0.2)'
      }
    ]
  };

  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    animation: false,
    maintainAspectRatio: false,
    scales: {
      y: { min: 0, max: 14, title: { display: true, text: 'pH' } },
      x: { title: { display: true, text: 'seconds' } }
    },
    plugins: {
      title: { display: true, text: 'Live pH Reading' }
    }
  };

  ngOnInit() {
    this.chartOptions!.plugins!.title!.text = `Meter ${this.meter}`;

    this.subs.add(
      this.readingsService.newReadings$.subscribe((batch) => this.addReadings(batch))
    );
    this.subs.add(
      this.settings.resetSignal.subscribe(() => this.reset())
    );
  }

  private addReadings(batch: Reading[]) {
    let changed = false;
    for (const r of batch) {
      if (r.meter !== this.meter) continue;     // not mine
      this.phByTime.set(r.time, r.ph_value);
      this.latest = Math.max(this.latest, r.time);
      changed = true;
    }
    if (changed) this.redraw();
  }

  private redraw() {
    const size = this.settings.maxPoints;
    const half = Math.floor(size / 2);
    const start = Math.max(0, this.latest - half);

    const labels: number[] = [];
    const data: (number | null)[] = [];

    for (let i = 0; i < size; i++) {
      const second = start + i;
      labels.push(second);
      data.push(this.phByTime.get(second) ?? null);
    }

    this.chartData = {
      labels: labels,
      datasets: [{ ...this.chartData.datasets[0], data: data }]
    };
  }

  private reset() {
    this.phByTime.clear();
    this.latest = 0;
    this.chartData = {
      labels: [],
      datasets: [{ ...this.chartData.datasets[0], data: [] }]
    };
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
