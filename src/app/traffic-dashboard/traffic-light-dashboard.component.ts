import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-traffic-light-dashboard',
  standalone: true,
  imports: [NgClass],
  templateUrl: './traffic-light-dashboard.component.html',
  styleUrls: ['./traffic-light-dashboard.component.css']
})
export class TrafficLightDashboardComponent implements OnInit {
  ngOnInit(): void {
      this.changeSignal("23")
      setTimeout(() => {
        this.changeSignal("22")
      }, 500);
  }
  // Estados simulados
  streetA = {
    light: 'yellow',
    prediction: 'Alto',
    vehicleCount: 3,
    image: '',
  };
  streetB = {
    light: 'green',
    prediction: 'Avance',
    vehicleCount: 1,
    image: '',
  };

  // Para cargar imágenes
  onImageUpload(event: any, street: 'A' | 'B') {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (street === 'A') this.streetA.image = e.target.result;
        else this.streetB.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Simulación de actualización periódica
  updateImages() {
    // Aquí iría la lógica para actualizar imágenes desde una API
  }

  signal = 12

  changeSignal(signal:string) {
    let light = {
    light: 'yellow',
    prediction: 'Alto',
    vehicleCount: 3,
    image: '',
  };;
    if(signal[0]=="1"){
        this.streetA.light = 'red';
        light = this.streetA
    } else if(signal[0]=="2"){
        this.streetB.light = 'red';
        light = this.streetB
    }
    
    if(signal[1]=="1"){
        light.light = 'green';
    } else if(signal[1]=="2"){
        light.light = 'green';
    } else if(signal[1]=="3"){
        light.light = 'yellow';
    }
  }

}
