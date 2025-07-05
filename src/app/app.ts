import { Component } from '@angular/core';
import { TrafficLightDashboardComponent } from './traffic-dashboard/traffic-light-dashboard.component';
import { FooterMenuComponent } from './footer-menu/footer-menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TrafficLightDashboardComponent, FooterMenuComponent],
  template: `
    <app-traffic-light-dashboard></app-traffic-light-dashboard>
    <app-footer-menu></app-footer-menu>
  `
})
export class App {}
