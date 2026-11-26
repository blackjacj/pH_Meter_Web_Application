import { Component, inject } from '@angular/core';
import { GraphSettingsService } from '../../services/graph-settings.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReadingsService } from '../../services/readings.service';

@Component({
  selector: 'app-side-panel',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './side-panel.component.html',
  styleUrl: './side-panel.component.css'
})
export class SidePanelComponent {
  constructor(public settings: GraphSettingsService) { }
  private http = inject(HttpClient);
  private readingsService = inject(ReadingsService);
  private api = 'http://127.0.0.1:5000';

  graph_seconds: number = 20;
  seconds: number = 60;
  testName: string = '';
  testNote: string = '';
  error: string = '';

  setPoint(n: number) {
    if (n > 0) {
      this.settings.maxPoints = n;
    }
  }

  setSeconds(s: number) {
    this.settings.testSeconds = s;
  }

  start_pressed = false;
  pressStart() {
    if (this.settings.startButtonPressed) return;

    if (!this.testName.trim()) {
      this.error = 'Please enter a test name.';
      return;
    }

    this.error = '';
    this.http.post<any>(`${this.api}/test`, {
      name: this.testName.trim(),
      note: this.testNote
    }).subscribe({
      next: (res) => this.startReading(res.id),
      error: (err) => this.error = err.error?.message || 'Could not create the test.'
    });
  }

  private startReading(id: number) {
  this.http.post(`${this.api}/test/${id}/start`, {
    port: this.settings.port,
    seconds: this.settings.testSeconds
  }).subscribe({
    next: () => {
      this.settings.testId = id;
      this.settings.startButtonPressed = true;
      this.settings.stopButtonPressed = false;
      this.readingsService.start(id);
    },
    error: (err) => this.error = err.error?.message || 'Could not start the test.'
  });
}


  pressStop() {
  if (!this.settings.startButtonPressed) return;

  const id = this.settings.testId;
  this.settings.startButtonPressed = false;
  this.settings.stopButtonPressed = true;
  this.readingsService.stop();

  if (id === null) {
    this.finish();
    return;
  }

  const askAboutCsv = () => {
    if (confirm('Test complete. Download a CSV file?')) {
      this.downloadCsv(id, () => this.finish());
    } else {
      this.finish();
    }
  };

  this.http.post(`${this.api}/test/${id}/stop`, {}).subscribe({
    next: askAboutCsv,
    error: askAboutCsv
  });
}

  private downloadCsv(id: number, done: () => void) {
    this.http.get(`${this.api}/test/${id}/export`, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${this.testName || 'test'}.csv`;
        a.click();
        URL.revokeObjectURL(a.href);
        done();
      },
      error: () => {
        this.error = 'Could not download the CSV.';
        done();
      }
    });
  }

  private finish() {
    this.settings.resetSignal.next();
    this.settings.testId = null;
    this.testName = '';
    this.testNote = '';
  }
}
