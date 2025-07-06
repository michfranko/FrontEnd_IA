import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Requests {

  constructor( private http: HttpClient ) {}

  solicitarDatos()  : Observable<any> {
    return this.http.get<any>('http://localhost:5000/')
  }
}
