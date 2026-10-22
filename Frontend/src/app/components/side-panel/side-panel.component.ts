import { Component } from '@angular/core';
import { GraphSettingsService } from '../../services/graph-settings.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-side-panel',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './side-panel.component.html',
  styleUrl: './side-panel.component.css'
})
export class SidePanelComponent {
  constructor(private settings: GraphSettingsService) { }

  graph_seconds: number = 20;

  setPoint(n: number) {
    if (n > 0) {
      this.settings.maxPoints = n;
    }
  }

  seconds: number = 60;

  setSeconds(s: number) {
    this.settings.testSeconds = s;
  }

  start_pressed = false;
  pressStart() {
    if (this.settings.startButtonPressed == false) {
      this.settings.startButtonPressed = true
      this.settings.pauseButtonPressed = false
      this.settings.stopButtonPressed = false
    } else {
      return
    }
  }

  pause_pressed = false;
  pressPause() {
    if (this.settings.pauseButtonPressed == false) {
      this.settings.startButtonPressed = false
      this.settings.pauseButtonPressed = true
      this.settings.stopButtonPressed = false
    } else {
      return
    }
  }
  stop_pressed = true;
  pressStop() {
    if (this.settings.stopButtonPressed == false) {
      this.settings.startButtonPressed = false
      this.settings.pauseButtonPressed = false
      this.settings.stopButtonPressed = true
      this.settings.resetSignal.next()
    } else {
      return
    }
  }
}
