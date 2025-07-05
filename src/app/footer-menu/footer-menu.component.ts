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
    window.open('https://github.com/tu-repo', '_blank');
  }
  toggleIntegrantes() {
    this.showIntegrantes = !this.showIntegrantes;
  }
  toggleAbout() {
    this.showAbout = !this.showAbout;
  }
}
