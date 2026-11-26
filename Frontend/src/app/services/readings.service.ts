import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

export interface Reading {
  meter: number;
  time: number;
  ph_value: number;
  voltage: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReadingsService {
  private http = inject(HttpClient);
  private timer: any;
  private lastTime = -1;

  newReadings$ = new Subject<Reading[]>();

  start(testId: number) {
    this.stop();
    this.lastTime = -1;

    this.timer = setInterval(() => {
      const after = this.lastTime - 1;
      this.http.get<Reading[]>(`http://127.0.0.1:5000/test/${testId}/readings?after=${after}`)
      .subscribe((batch) => {
        if (batch.length === 0) return;
        this.lastTime = Math.max(this.lastTime, ...batch.map((r) => r.time));
        this.newReadings$.next(batch);
      });
    }, 1000);
  }

  stop() {
    clearInterval(this.timer);
  }
}
