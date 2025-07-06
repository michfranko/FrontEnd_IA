import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { FooterMenuComponent } from '../footer-menu/footer-menu.component';
import { Requests } from '../service/requests';

@Component({
  selector: 'app-traffic-light-dashboard',
  standalone: true,
  imports: [NgClass, FooterMenuComponent],
  templateUrl: './traffic-light-dashboard.component.html',
  styleUrls: ['./traffic-light-dashboard.component.css']
})
export class TrafficLightDashboardComponent implements OnInit {
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
        this.changeSignal(data[0]+"");
        this.streetA.prediction = data[1]+"";
        this.streetB.prediction = data[2]+"";
        this.streetA.vehicleCount = data[3];
        this.streetB.vehicleCount = data[4];
      })
    }, 3000);
  }
  constructor(private sol:Requests) {}
  
  // Para cargar imágenes
  onImageUpload(event: any, street: 'A' | 'B') {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
      // Asignar la imagen cargada para pruebas
      };
      reader.readAsDataURL(file);
    }
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
