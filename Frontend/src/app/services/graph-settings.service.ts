import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GraphSettingsService {
  maxPoints = 20;
  testSeconds = 60;
  startButtonPressed = false;
  stopButtonPressed = false;
  resetSignal = new Subject<void>();
  testId: number | null = null;
  port = 'COM3';
}
