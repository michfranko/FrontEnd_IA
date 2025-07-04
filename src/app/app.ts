import { Component } from '@angular/core';
import { TrafficLightDashboardComponent } from './traffic-dashboard/traffic-light-dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TrafficLightDashboardComponent],
  template: `<app-traffic-light-dashboard></app-traffic-light-dashboard>`
})
export class App {}
