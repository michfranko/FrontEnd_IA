import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeminiAPI {

  private apiKey = 'AIzaSyAntpN-wt27vjdy2IYdjgBVKO_TlVEzuRY';
  private url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  constructor(private http: HttpClient) {}

  generarContenido(prompt: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-goog-api-key': this.apiKey
    });

    const body = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    };

    return this.http.post(this.url, body, { headers });
  }
}
