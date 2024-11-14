import { Component, Input, OnInit } from '@angular/core';
import { Asistencia } from 'src/app/model/asistencia';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { ToastController } from '@ionic/angular'; // Importa ToastController
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-mi-clase',
  standalone: true, // Declara que es un componente standalone
  templateUrl: './mi-clase.component.html',
  styleUrls: ['./mi-clase.component.scss'],
  imports: [IonicModule, CommonModule, TranslateModule], // Importa IonicModule y CommonModule
})
export class MiClaseComponent {

  asistencia: any;

  constructor(private authService: AuthService) {
    this.authService.qrCodeData.subscribe((qrData) => {
      this.asistencia = qrData? JSON.parse(qrData): null;
    })
  }

}