import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryService, AnalysisRecord } from '../service/history.service';
import { HistorialComponent } from '../Historial/historial.component';

@Component({
  selector: 'app-footer-menu',
  standalone: true,
  imports: [CommonModule, HistorialComponent],
  templateUrl: './footer-menu.component.html',
  styleUrls: ['./footer-menu.component.css']
})
export class FooterMenuComponent implements OnInit {
  showIntegrantes = false;
  showAbout = false;
  showHistory = false;
  history: AnalysisRecord[] = [];

  constructor(private historyService: HistoryService) {}

  ngOnInit(): void {
  this.historyService.getHistory().subscribe(
    data => this.history = data,
    error => console.error('Error al cargar el historial', error)
  );
}

  openGithub() {
    window.open('https://github.com/SirYorch/Smart-Traffic-Light', '_blank');
  }

  toggleIntegrantes() {
    this.showIntegrantes = !this.showIntegrantes;
    this.showAbout = false;
    this.showHistory = false;
  }

  toggleAbout() {
    this.showAbout = !this.showAbout;
    this.showIntegrantes = false;
    this.showHistory = false;
  }

  toggleHistory() {
  this.showHistory = !this.showHistory;
  if (this.showHistory) {
    this.historyService.getHistory().subscribe(
      data => {this.history = data
        console.log(data);
      },
      error => console.error('Error al cargar el historial', error)
    );
  }
  this.showIntegrantes = false;
  this.showAbout = false;
}
}