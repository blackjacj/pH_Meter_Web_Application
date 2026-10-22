import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GraphSettingsService {
  maxPoints = 20;
  testSeconds = 60;
  startButtonPressed = false;
  pauseButtonPressed = false;
  stopButtonPressed = false;
  resetSignal = new Subject<void>();
}
