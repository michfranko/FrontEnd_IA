import { Component, OnInit } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { FooterMenuComponent } from '../footer-menu/footer-menu.component';
import { Requests } from '../service/requests';
import { GeminiAPI } from '../service/gemini-api';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HistoryService } from '../service/history.service';

@Component({
  selector: 'app-traffic-light-dashboard',
  standalone: true,
  imports: [NgClass, NgIf, FooterMenuComponent],
  templateUrl: './traffic-light-dashboard.component.html',
  styleUrls: ['./traffic-light-dashboard.component.css']
})
export class TrafficLightDashboardComponent implements OnInit {
  imagen1:File | null = null;
  imagen2:File | null = null;

CargarImagen(event: Event, street: 'A' | 'B') {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e: any) => {
    if (street === 'A') {
      this.imagen1 = file;
      this.imagenUrl1 = e.target.result;  // Mostrar en el HTML temporalmente
    } else {
      this.imagen2 = file;
      this.imagenUrl2 = e.target.result;  // Mostrar en el HTML temporalmente
    }
  };
  reader.readAsDataURL(file);
}
AnalizarImagenes() {
  if (!this.imagen1 || !this.imagen2) {
    this.mensajeTexto = "Debe subir las dos imagenes para realizar la comparacion.";
    this.mensajeVisible = true;
    return;
  }

  const originalImageUrl1 = this.imagenUrl1;
  const originalImageUrl2 = this.imagenUrl2;

  if (this.imagen1) {
    this.sol.sendImg1(this.imagen1).subscribe({
      next: (response) => {
        if (this.imagen2) {
          this.sol.sendImg2(this.imagen2).subscribe({
            next: (response) => {
              this.datos = this.sol.solicitarDatos().subscribe((data) => {
                this.actualizarImagen();
                this.changeSignal(data[0] + "");
                this.streetA.prediction = data[1] + "";
                this.streetB.prediction = data[2] + "";
                this.streetA.vehicleCount = data[3];
                this.streetB.vehicleCount = data[4];

                this.gem.generarContenido('Genera un texto corto muy consiso hazlo sin dudas o preguntas en donde expliques, cual es la calle que debe tener preferencia y el tiempo aproximado que debería estar activa esa preferencia si, estamos en una intersección con semaforo, la primera calle tiene ' + this.streetA.vehicleCount + " vehiculos, y la segunda calle tiene " + this.streetB.vehicleCount + " vehiculos").subscribe({
                  next: (response: any) => {
                    this.mensajeTexto = response.candidates[0]?.content?.parts[0]?.text || 'No se pudo generar texto';
                    this.historyService.addAnalysis({
                      imageUrl1: originalImageUrl1,
                      imageUrl2: originalImageUrl2,
                      predictionA: this.streetA.prediction,
                      predictionB: this.streetB.prediction,
                      vehicleCountA: this.streetA.vehicleCount,
                      vehicleCountB: this.streetB.vehicleCount,
                      recommendation: this.mensajeTexto
                    });
                  },
                  error: (err) => console.error('Error al generar contenido:', err)
                });
              })
            },
            error: (err) => console.error('Error al analizar imagen B:', err)
          });
        }
      },
      error: (err) => console.error('Error al analizar imagen A:', err)
    });
  }

  this.showPredictionModal = true;
}



  imagenBaseUrl1 = '/api/im1';
  imagenBaseUrl2 = '/api/im2';

  imagenUrl1 = ''
  imagenUrl2 = ''
  // Estados simulados
  streetA = {
    light: 'yellow',
    prediction: 'Alto',
    vehicleCount: 3,
  };
  streetB = {
    light: 'green',
    prediction: 'Avance',
    vehicleCount: 1
  };

  datos: any;
  ngOnInit(): void {
    this.imagen1 = null;
    this.imagen2 = null;
    // this.datos = this.sol.solicitarDatos().subscribe((data) => {
    //     this.changeSignal(data[0]+"");
    //     this.streetA.prediction = data[1]+"";
    //     this.streetB.prediction = data[2]+"";
    //     this.streetA.vehicleCount = data[3];
    //     this.streetB.vehicleCount = data[4];
    //   })
    // Cargar imágenes por defecto desde la carpeta public como File
    fetch('foto1.jpg')
      .then(res => res.blob())
      .then(blob => {
      this.imagen1 = new File([blob], 'foto1.jpg', { type: blob.type });
      this.imagenUrl1 = 'foto1.jpg';
      });
    fetch('foto2.jpg')
      .then(res => res.blob())
      .then(blob => {
      this.imagen2 = new File([blob], 'foto2.jpg', { type: blob.type });
      this.imagenUrl2 = 'foto2.jpg';
      });
    // setInterval(() => {
    //   this.datos = this.sol.solicitarDatos().subscribe((data) => {
    //     this.actualizarImagen();1
    //     this.changeSignal(data[0]+"");
    //     this.streetA.prediction = data[1]+"";
    //     this.streetB.prediction = data[2]+"";
    //     this.streetA.vehicleCount = data[3];
    //     this.streetB.vehicleCount = data[4];
    //   })
    // }, 6000);

    this.mostrarMensajeInicial();
  }
  constructor(private sol:Requests ,private gem:GeminiAPI, private historyService: HistoryService) {}
  actualizarImagen(): void {
    const timestamp = new Date().getTime();
    this.imagenUrl1 = `${this.imagenBaseUrl1}?t=${timestamp}`;
    this.imagenUrl2 = `${this.imagenBaseUrl2}?t=${timestamp}`;
  }
  showPredictionModal = false;
  predictionImage: string | null = null;
  predictionVehicleCount: number | null = null;

 
 onImageUpload(event: any) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.predictionImage = e.target.result; // Guarda la imagen subida como base64
    };
    reader.readAsDataURL(file);
    this.sol.sendImg(file).subscribe({
      next: (response) => {
        console.log('Respuesta del backend:', response);
        this.predictionVehicleCount = response.results?.length ?? 0; // Guarda el conteo real
        this.showPredictionModal = true; // Muestra el modal flotante

        setTimeout(() => {
          this.predictionImage = null; 
          const timestamp = new Date().getTime();
          let imgUrlTest = "/imTest"
          this.predictionImage = `${imgUrlTest}?t=${timestamp}`;
        }, 500); 
      },
      error: (err) => {
        console.error('Error al enviar la imagen:', err);
      }
    });
  }
  
}

 PredecirConjunto(event: any) {
  
}
    
    
  

  closePredictionModal() {
    this.showPredictionModal = false;
    this.predictionImage = null;
    this.predictionVehicleCount = null;
  }

  signal = 12;

  encenderLux(time:number, street:number) {
    if(street == 1){
      this.changeSignal("13");
      setTimeout(() => {
        this.changeSignal("12");
        setTimeout(() => {
          this.changeSignal("11");
        }, 2000);
      }, time);
    } else if (street == 2){
      this.changeSignal("23");
      setTimeout(() => {
        this.changeSignal("22");
        setTimeout(() => {
          this.changeSignal("21");
        }, 2000);
      }, time);
    }
  }

  changeSignal(signal:string) {
    let light = { light: 'yellow' };
    if(signal[0]=="1"){
      this.streetB.light = 'red';
      light = this.streetA;
    } else if(signal[0]=="2"){
      this.streetA.light = 'red';
      light = this.streetB;
    }
    if(signal[1]=="1"){
      light.light = 'red';
    } else if(signal[1]=="2"){
      light.light = 'yellow';
    } else if(signal[1]=="3"){
      light.light = 'green';
    }
  }



mensajeVisible = false;
mensajeTexto = '';


mostrarMensajeInicial() {
  this.mensajeTexto = 'El sistema está listo para analizar imágenes.';
  this.mensajeVisible = true;

  
}


}
