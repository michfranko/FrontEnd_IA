import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Requests {
  sendImg(img:File) {
    const formData = new FormData();
    formData.append('image', img); 
    return this.http.post<any>('http://localhost:5000/send', formData);
  }

  constructor( private http: HttpClient ) {}

  solicitarDatos()  : Observable<any> {
    return this.http.get<any>('http://localhost:5000/')
  }
}
