import { Component, inject } from '@angular/core';
import { GraphSettingsService } from '../../services/graph-settings.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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
    this.http.post<any>('http://127.0.0.1:5000/test', {
      name: this.testName.trim(),
      note: this.testNote
    }).subscribe({
      next: (res) => {
        this.settings.testId = res.id;
        this.settings.startButtonPressed = true;
        this.settings.stopButtonPressed = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Coult not create the test.'
      }
    });
  }

  stop_pressed = true;
  pressStop() {
    if (!this.settings.startButtonPressed) return;
    
    this.settings.startButtonPressed = false;
    this.settings.stopButtonPressed = true;

    const id = this.settings.testId;
    if (id !== null && confirm('Test complete. Download a CSV file?')) {
      this.downloadCsv(id, () => this.finish());
    } else {
      this.finish()
    }
  }

  private downloadCsv(id: number, done: () => void) {
    this.http.get(`http://127.0.0.1:5000/test/${id}/export`, { responseType: 'blob'}).subscribe({
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
