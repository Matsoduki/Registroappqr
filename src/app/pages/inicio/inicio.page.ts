import { Component, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { IonContent } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { ForoComponent } from 'src/app/components/foro/foro.component';
import { MisDatosComponent } from 'src/app/components/mis-datos/mis-datos.component';
import { CodigoqrComponent } from 'src/app/components/codigoqr/codigoqr.component';
import { MiClaseComponent } from 'src/app/components/mi-clase/mi-clase.component';
import { Router } from '@angular/router';
import { Asistencia } from 'src/app/model/asistencia';
import { ScannerService } from 'src/app/services/scanner.service';

@Component({
  selector: 'app-inicio',
  templateUrl: 'inicio.page.html',
  styleUrls: ['inicio.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonContent,
    HeaderComponent,
    FooterComponent,
    CodigoqrComponent,
    ForoComponent,
    MisDatosComponent,
    MiClaseComponent // Asegúrate de que esté aquí
  ]
})
export class InicioPage {
  @ViewChild(FooterComponent) footer!: FooterComponent;
  selectedComponent = 'codigoqr';
  asistencia: Asistencia | null = null;

  constructor(private auth: AuthService, private scanner: ScannerService) {
    this.auth.selectedComponent.subscribe((selectedComponent) => {
      this.selectedComponent = selectedComponent;
    });
  }

  qrTest() {
    this.showMiClaseComponent(Asistencia.jsonExample);
  }

  webQrScanned(qr: string) {
    this.showMiClaseComponent(qr);
  }

  showMiClaseComponent(qr: string) {
    if (qr === '') {
      this.footer.segmentChanged('codigoqr');
      return;
    }
    if (Asistencia.isValidAsistenciaQrCode(qr, true)) {
      this.auth.qrCodeData.next(qr);
      this.footer.segmentChanged('mi-clase');
    } else {
      this.footer.segmentChanged('codigoqr');
    }
  }

  webQrStopped() {
    console.log('Escaneo detenido');
  }

  headerClick(event: any) {
    console.log('Header clicked:', event);
  }
}