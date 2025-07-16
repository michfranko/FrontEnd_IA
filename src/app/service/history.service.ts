import { Injectable } from '@angular/core';

export interface AnalysisRecord {
  id: number;
  date: string;
  imageUrl1: string;
  imageUrl2: string;
  vehicleCountA: number;
  vehicleCountB: number;
  lightA: string;
  lightB: string;
}

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private static readonly STORAGE_KEY = 'analysis_history';

  constructor() { }

  getHistory(): AnalysisRecord[] {
    const historyJson = localStorage.getItem(HistoryService.STORAGE_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  }

  addAnalysis(record: Omit<AnalysisRecord, 'id' | 'date'>): void {
    const history = this.getHistory();
    const newRecord: AnalysisRecord = {
      ...record,
      id: new Date().getTime(),
      date: new Date().toISOString()
    };
    history.unshift(newRecord);
    localStorage.setItem(HistoryService.STORAGE_KEY, JSON.stringify(history));
  }
}
