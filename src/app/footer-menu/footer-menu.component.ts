import { Component } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-footer-menu',
  standalone: true,
  imports: [NgIf],
  templateUrl: './footer-menu.component.html',
  styleUrls: ['./footer-menu.component.css']
})
export class FooterMenuComponent {
  showIntegrantes = false;
  showAbout = false;

  openGithub() {
    window.open('https://github.com/SirYorch/Smart-Traffic-Light', '_blank');
  }
  toggleIntegrantes() {
    this.showIntegrantes = !this.showIntegrantes;
    if(this.showAbout && this.showIntegrantes) {
      this.showAbout = false; // Hide About section when Integrantes is toggled
    }
  }
  toggleAbout() {
    this.showAbout = !this.showAbout;
    console.log('About section toggled:', this.showAbout);
    console.log('Integrantes section visibility:', this.showIntegrantes);
    if(this.showAbout && this.showIntegrantes) {
      this.showIntegrantes = false; // Hide Integrantes section when About is toggled
    }
  }
}
