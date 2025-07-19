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
        lightA: this.changeSignal(r.traffic_signal, 1),
        lightB: this.changeSignal(r.traffic_signal, 2)
      })))
    );
  }
  addAnalysis(record: Omit<AnalysisRecord, 'id' | 'date'>): Observable<any> {
    return this.http.post(this.API_URL, record);
  }

 changeSignal(signal:string,street:number): string {
    if(signal[0]=="1" && street ==2){
      return 'red';
    } else if(signal[0]=="2" && street ==1){
      return 'red'
    }
    if(signal[1]=="1"){
      return 'red';
    } else if(signal[1]=="2"){
      return 'yellow';
    } else if(signal[1]=="3"){
      return 'green';
  }return"";
 }
}
