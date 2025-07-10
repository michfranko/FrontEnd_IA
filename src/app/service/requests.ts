import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Requests {
  sendImg(img:File) {
    console.log('Enviando imagen al servidor:', img);
    const formData = new FormData();
    formData.append('image', img); 
    return this.http.post<any>('http://localhost:5000/send', formData);
  }
  sendImg1(img:File) {
    console.log('Enviando imagen al servidor:', img);
    const formData = new FormData();
    formData.append('image', img); 
    return this.http.post<any>('http://localhost:5000/send1', formData);
  }
  sendImg2(img:File) {
    console.log('Enviando imagen al servidor:', img);
    const formData = new FormData();
    formData.append('image', img); 
    return this.http.post<any>('http://localhost:5000/send2', formData);
  }

  constructor( private http: HttpClient ) {}

  solicitarDatos()  : Observable<any> {
    return this.http.get<any>('http://localhost:5000/')
  }
}
