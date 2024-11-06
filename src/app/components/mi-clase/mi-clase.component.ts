import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Asistencia } from 'src/app/model/asistencia';
import { CommonModule } from '@angular/common'; // Importar CommonModule

@Component({
  selector: 'app-mi-clase',
  templateUrl: './mi-clase.component.html',
  styleUrls: ['./mi-clase.component.scss'],
  standalone: true,
  imports: [CommonModule] // Agregar CommonModule aquí
})
export class MiClaseComponent {
  asistencia!: Asistencia;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.asistencia = navigation.extras.state['asistencia'];
      console.log('Asistencia recibida:', this.asistencia);
    } else {
      console.error('No se recibieron datos de asistencia');
    }
  }
}