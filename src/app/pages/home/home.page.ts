import { Component, ViewChild } from '@angular/core';
import { DinosaurComponent } from 'src/app/components/dinosaur/dinosaur.component';
import { AuthService } from 'src/app/services/auth.service';
import { IonContent } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
// import { QrWebScannerComponent } from 'src/app/components/qr-web-scanner/qr-web-scanner.component';
import { Dinosaur } from 'src/app/model/dinosaur';
import { Capacitor } from '@capacitor/core';
import { ScannerService } from 'src/app/services/scanner.service';
import { WelcomeComponent } from 'src/app/components/welcome/welcome.component';
import { ForumComponent } from 'src/app/components/forum/forum.component';
import { MisDatosComponent } from 'src/app/components/mis-datos/mis-datos.component';// Asegúrate de que la ruta sea correcta
import { CodigoqrComponent } from 'src/app/components/codigoqr/codigoqr.component';

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
    DinosaurComponent,
    ForumComponent,
    MisDatosComponent // Asegúrate de agregar este componente
  ]
})
export class HomePage {
  @ViewChild(FooterComponent) footer!: FooterComponent;
  selectedComponent = 'welcome';

  constructor(private auth: AuthService, private scanner: ScannerService) { }

  ionViewWillEnter() {
    this.changeComponent('codigoqr');
  }

  async headerClick(button: string) {
    try {
      switch (button) {
        case 'testqr':
          this.showDinoComponent(Dinosaur.jsonDinoExample);
          break;

        case 'scan':
          if (Capacitor.getPlatform() === 'web') {
            this.selectedComponent = 'qrwebscanner';
          } else {
            const scannedData = await this.scanner.scan();
            this.showDinoComponent(scannedData);
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
    this.showDinoComponent(qr);
  }

  webQrStopped() {
    this.changeComponent('welcome');
  }

  showDinoComponent(qr: string) {
    if (Dinosaur.isValidDinosaurQrCode(qr)) {
      this.auth.qrCodeData.next(qr);
      this.changeComponent('dinosaur');
    } else {
      this.changeComponent('welcome');
    }
  }

  footerClick(button: string) {
    if (button === 'mis-datos') { // Asegúrate de que este botón maneje correctamente
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