import { Component, OnInit } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { FooterMenuComponent } from '../footer-menu/footer-menu.component';
import { Requests } from '../service/requests';

@Component({
  selector: 'app-traffic-light-dashboard',
  standalone: true,
  imports: [NgClass, NgIf, FooterMenuComponent],
  templateUrl: './traffic-light-dashboard.component.html',
  styleUrls: ['./traffic-light-dashboard.component.css']
})
export class TrafficLightDashboardComponent implements OnInit {

  imagenBaseUrl1 = 'http://127.0.0.1:5000/im1';
  imagenBaseUrl2 = 'http://127.0.0.1:5000/im2';

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
    this.datos = this.sol.solicitarDatos().subscribe((data) => {
        this.changeSignal(data[0]+"");
        this.streetA.prediction = data[1]+"";
        this.streetB.prediction = data[2]+"";
        this.streetA.vehicleCount = data[3];
        this.streetB.vehicleCount = data[4];
      })

    setInterval(() => {
      this.datos = this.sol.solicitarDatos().subscribe((data) => {
        this.actualizarImagen();1
        this.changeSignal(data[0]+"");
        this.streetA.prediction = data[1]+"";
        this.streetB.prediction = data[2]+"";
        this.streetA.vehicleCount = data[3];
        this.streetB.vehicleCount = data[4];
      })
    }, 3000);
  }
  constructor(private sol:Requests) {}
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
          let imgUrlTest = "http://127.0.0.1:5000/imTest"
          this.predictionImage = `${imgUrlTest}?t=${timestamp}`;
        }, 500); 
      },
      error: (err) => {
        console.error('Error al enviar la imagen:', err);
      }
    });
  }
  
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
}
