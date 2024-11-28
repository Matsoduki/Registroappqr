import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { IonContent, IonButton, IonLabel } from '@ionic/angular/standalone';
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
import { Capacitor } from '@capacitor/core';
import { UsuariosComponent } from 'src/app/components/usuarios/usuarios.component';
import { Usuario } from 'src/app/model/usuario';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-inicio',
  templateUrl: 'inicio.page.html',
  styleUrls: ['inicio.page.scss'],
  standalone: true,
  imports: [IonLabel, IonButton, 
    CommonModule,
    FormsModule,
    TranslateModule,
    IonContent,
    HeaderComponent,
    FooterComponent,
    CodigoqrComponent,
    ForoComponent,
    MisDatosComponent,
    UsuariosComponent,
    MiClaseComponent // Asegúrate de que esté aquí
  ]
})

export class InicioPage implements OnInit {
  @Input() startScan: boolean = false;
  @ViewChild(FooterComponent) footer!: FooterComponent;
  selectedComponent: string | null = null; // Sin valor inicial fijo
  asistencia: Asistencia | null = null;
  initialCheck = false;

  usuario = new Usuario();
  private authUserSubs!: Subscription;

  constructor(private auth: AuthService, private scanner: ScannerService) {
    this.auth.selectedComponent.subscribe((selectedComponent) => {
      if (this.selectedComponent === null) {
        this.selectedComponent = selectedComponent;
      }
    });
  }

  ngOnInit() {
    this.startQrScan();
    this.authUserSubs = this.auth.authUser.subscribe(usuario => {
        this.usuario = usuario ?? new Usuario();
    });

    // Verifica si initialCheck es falso antes de ejecutar checkUserType
    if (!this.initialCheck) {
      this.checkUserType();
    }
    
    this.auth.selectedComponent.subscribe((selectedComponent) => {
      this.selectedComponent = selectedComponent;
    });
  }

  checkUserType() {
    if (this.usuario.username === 'admin') {
      this.auth.selectedComponent.next('usuarios'); // Admin comienza en 'usuarios'
    } else {
      this.auth.selectedComponent.next('codigoqr'); // Otros comienzan en 'codigoqr'
    }
    this.initialCheck = true;
  }

  async startQrScan() {
    if (Capacitor.getPlatform() === 'web') {
      if (this.selectedComponent === null) {
        this.selectedComponent = 'codigoqr';
      }
    } else {
      const qrResult = await this.scanner.scan();
      this.showMiClaseComponent(qrResult);
    }
  }

  qrTest() {
    // Simulador de escaneo con un QR de prueba
    this.showMiClaseComponent(Asistencia.jsonExample);
  }

  webQrScanned(qr: string) {
    // Cuando se escanea un código QR
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
