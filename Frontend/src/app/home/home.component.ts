import { Component } from '@angular/core';
import { GraphComponent } from '../components/graph/graph.component';
import { SidePanelComponent } from '../components/side-panel/side-panel.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [GraphComponent, SidePanelComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
