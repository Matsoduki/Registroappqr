import { Component, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { IonContent } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { Capacitor } from '@capacitor/core';
import { ScannerService } from 'src/app/services/scanner.service';
import { WelcomeComponent } from 'src/app/components/welcome/welcome.component';
import { ForumComponent } from 'src/app/components/forum/forum.component';
import { MisDatosComponent } from 'src/app/components/mis-datos/mis-datos.component';
import { CodigoqrComponent } from 'src/app/components/codigoqr/codigoqr.component';
import { Asistencia } from 'src/app/model/asistencia'; // Importa el modelo Asistencia
import { Router } from '@angular/router'; // Importa el router

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonContent,
    HeaderComponent,
    FooterComponent,
    WelcomeComponent,
    CodigoqrComponent,
    ForumComponent,
    MisDatosComponent
  ]
})
export class HomePage {
  @ViewChild(FooterComponent) footer!: FooterComponent;
  selectedComponent = 'welcome';

  constructor(private auth: AuthService, private scanner: ScannerService, private router: Router) { }

  ionViewWillEnter() {
    this.changeComponent('codigoqr');
  }

  async headerClick(button: string) {
    try {
      switch (button) {
        case 'scan':
          if (Capacitor.getPlatform() === 'web') {
            this.selectedComponent = 'qrwebscanner';
          } else {
            const scannedData = await this.scanner.scan();
            this.handleScannedData(scannedData);
          }
          break;

        default:
          console.warn(`Botón no manejado: ${button}`);
          break;
      }
    } catch (error) {
      console.error('Error al manejar el clic en el encabezado:', error);
    }
  }

  webQrScanned(qr: string) {
    this.handleScannedData(qr);
  }

  webQrStopped() {
    this.changeComponent('welcome');
  }

  handleScannedData(qr: string) {
    if (Asistencia.isValidAsistenciaQrCode(qr)) {
      const asistenciaData = JSON.parse(qr);
      const asistencia = Asistencia.getNewAsistencia(
        asistenciaData.sede,
        asistenciaData.idAsignatura,
        asistenciaData.seccion,
        asistenciaData.nombreAsignatura,
        asistenciaData.nombreProfesor,
        asistenciaData.dia,
        asistenciaData.bloqueInicio,
        asistenciaData.bloqueTermino,
        asistenciaData.horaInicio,
        asistenciaData.horaFin
      );

      this.auth.qrCodeData.next(qr); // Maneja el código QR escaneado de acuerdo a tu lógica
      console.log('Asistencia válida:', asistencia);
      this.router.navigate(['/mi-clase'], {
        state: { asistencia } // Pasa los datos de asistencia si es necesario
      });
    } else {
      console.error('El código QR escaneado no corresponde a una asistencia válida');
      this.changeComponent('welcome');
    }
  }

  footerClick(button: string) {
    if (button === 'mis-datos') {
      this.selectedComponent = 'mis-datos';
    } else {
      this.selectedComponent = button;
    }
  }

  changeComponent(name: string) {
    this.selectedComponent = name;
    this.footer.selectedButton = name;
  }
}