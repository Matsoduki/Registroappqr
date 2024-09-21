import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Asistencia } from '../interfaces/asistencia';  // Ajusta la ruta según sea necesario

@Component({
  selector: 'app-mi-clase',
  templateUrl: './mi-clase.page.html',
  styleUrls: ['./mi-clase.page.scss'],
})
export class MiClasePage {
  asistencia: Asistencia;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.asistencia = navigation?.extras.state?.['asistencia'];

    if (!this.asistencia) {
      console.error('No se recibieron datos de asistencia');
    }
  }
}