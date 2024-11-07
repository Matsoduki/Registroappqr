import { Component, Input, OnInit } from '@angular/core';
import { Asistencia } from 'src/app/model/asistencia';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common'; // Importa CommonModule

@Component({
  selector: 'app-mi-clase',
  standalone: true, // Declara que es un componente standalone
  templateUrl: './mi-clase.component.html',
  styleUrls: ['./mi-clase.component.scss'],
  imports: [IonicModule, CommonModule], // Importa IonicModule y CommonModule
})
export class MiClaseComponent implements OnInit {
  @Input() asistencia!: Asistencia | null;
  historial: any[] = [];

  constructor(
    private db: DatabaseService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (this.asistencia) {
      console.log('Asistencia recibida:', this.asistencia);
    } else {
      console.error('No se recibieron datos de asistencia');
    }
  }

  async guardarAsistencia() {
    const usuario = await this.authService.readAuthUser();
    if (usuario && this.asistencia) {
      await this.db.saveUserAsistencia(usuario.username, this.asistencia);
      console.log('Asistencia guardada para:', usuario.username);
    } else {
      console.error('No hay usuario autenticado o datos de asistencia inválidos.');
    }
  }

  async verHistorial() {
    const usuario = await this.authService.readAuthUser();
    if (usuario) {
      this.historial = await this.db.getHistorialAsistencias(usuario.username);
      console.log('Historial de asistencias:', this.historial);
    } else {
      console.error('No hay usuario autenticado.');
    }
  }

  async limpiarHistorial() {
    const usuario = await this.authService.readAuthUser();
    if (usuario) {
      await this.db.clearHistorialAsistencias();
      this.historial = [];
      console.log("Historial de asistencias ha sido limpiado.");
    } else {
      console.error('No hay usuario autenticado.');
    }
  }
}