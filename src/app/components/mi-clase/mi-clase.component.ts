import { Component, Input, OnInit } from '@angular/core';
import { Asistencia } from 'src/app/model/asistencia';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { ToastController } from '@ionic/angular'; // Importa ToastController

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
  noHistorialVisible: boolean = false; // Variable para controlar la visibilidad del mensaje

  constructor(
    private db: DatabaseService,
    private authService: AuthService,
    private toastController: ToastController // Inyecta ToastController
  ) {}

  ngOnInit() {
    if (this.asistencia) {
      console.log('Asistencia recibida:', this.asistencia);
    } else {
      console.error('No se recibieron datos de asistencia');
    }
  }

  // Método para mostrar un toast
  async presentToast(message: string, duration: number = 2000) {
    const toast = await this.toastController.create({
      message,
      duration,
      position: 'middle',
      color: 'success',
    });
    toast.present();
  }

  async guardarAsistencia() {
    const usuario = await this.authService.readAuthUser();
    if (usuario && this.asistencia) {
      await this.db.saveUserAsistencia(usuario.username, this.asistencia);
      this.presentToast('Asistencia guardada con éxito.'); // Mostrar toast de éxito
      console.log('Asistencia guardada para:', usuario.username);
    } else {
      this.presentToast('Error al guardar la asistencia.', 3000); // Mostrar toast de error
      console.error('No hay usuario autenticado o datos de asistencia inválidos.');
    }
  }

  async verHistorial() {
    const usuario = await this.authService.readAuthUser();
    if (usuario) {
      this.historial = await this.db.getHistorialAsistencias(usuario.username);
      if (this.historial.length === 0) {
        this.noHistorialVisible = true; // Muestra el mensaje si no hay asistencias
        this.presentToast('No hay asistencias registradas en el historial.', 3000);
      } else {
        this.noHistorialVisible = false; // Oculta el mensaje si hay asistencias
      }
      this.presentToast('Historial de asistencias cargado.'); // Mostrar toast de éxito
      console.log('Historial de asistencias:', this.historial);
    } else {
      this.presentToast('No hay usuario autenticado.', 3000); // Mostrar toast de error
      console.error('No hay usuario autenticado.');
    }
  }

  async limpiarHistorial() {
    const usuario = await this.authService.readAuthUser();
    if (usuario) {
      await this.db.clearHistorialAsistencias();
      this.historial = [];
      this.noHistorialVisible = true; // Muestra el mensaje cuando se limpia el historial
      this.presentToast('Historial de asistencias ha sido limpiado.'); // Mostrar toast de éxito
      console.log("Historial de asistencias ha sido limpiado.");
    } else {
      this.presentToast('No hay usuario autenticado.', 3000); // Mostrar toast de error
      console.error('No hay usuario autenticado.');
    }
  }
}