import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalysisRecord } from '../service/history.service';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent {
  @Input() history: AnalysisRecord[] = [];
}
