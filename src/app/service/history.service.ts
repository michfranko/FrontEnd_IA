import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

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
  private readonly API_URL = 'http://localhost:5000/api/history';

  constructor(private http: HttpClient) {}

  getHistory(): Observable<AnalysisRecord[]> {
    return this.http.get<any[]>(this.API_URL).pipe(
      map(records => records.map(r => ({
        id: r.id,
        date: r.analysis_date,
        imageUrl1: r.image_url_1,
        imageUrl2: r.image_url_2,
        vehicleCountA: r.vehicle_count_a,
        vehicleCountB: r.vehicle_count_b,
        lightA: r.traffic_signal,
        lightB: r.traffic_signal
      })))
    );
  }
  addAnalysis(record: Omit<AnalysisRecord, 'id' | 'date'>): Observable<any> {
    return this.http.post(this.API_URL, record);
  }
}
