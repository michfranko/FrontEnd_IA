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

    this.encenderLux(1000, 1);
    setTimeout(() => {
      this.encenderLux(1000, 2);
    }, 4000);
      
  }
  // Estados simulados
  streetA = {
    light: 'yellow',
    prediction: 'Alto',
    vehicleCount: 3,
    image: 'foto1.jpg',
  };
  streetB = {
    light: 'green',
    prediction: 'Avance',
    vehicleCount: 1,
    image: 'foto2.jpg',
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

  encenderLux(time:number, street:number) {
    if(street == 1){
      this.changeSignal("13")
    setTimeout(() => {
        this.changeSignal("12")
      setTimeout(() => {
        this.changeSignal("11")
      }, 2000);
    }, time);
    } else if (street == 2){
      this.changeSignal("23")
    setTimeout(() => {
        this.changeSignal("22")
      setTimeout(() => {
        this.changeSignal("21")
      }, 2000);
    }, time);
    }
  }

  changeSignal(signal:string) {
    let light = {
    light: 'yellow',
  };
  
    if(signal[0]=="1"){
        this.streetB.light = 'red';
        light = this.streetA
        console.log("primera luz roja")
    } else if(signal[0]=="2"){
        this.streetA.light = 'red';
        light = this.streetB
        console.log("segunda luz roja")
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
