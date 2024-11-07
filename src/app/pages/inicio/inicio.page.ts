import { Component, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { IonContent } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { ForumComponent } from 'src/app/components/forum/forum.component';
import { MisDatosComponent } from 'src/app/components/mis-datos/mis-datos.component';
import { CodigoqrComponent } from 'src/app/components/codigoqr/codigoqr.component';
import { MiClaseComponent } from 'src/app/components/mi-clase/mi-clase.component';
import { Router } from '@angular/router';
import { Asistencia } from 'src/app/model/asistencia';

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
    ForumComponent,
    MisDatosComponent,
    MiClaseComponent // Asegúrate de que esté aquí
  ]
})
export class InicioPage {
  @ViewChild(FooterComponent) footer!: FooterComponent;
  selectedComponent = 'codigoqr';
  asistencia: Asistencia | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  ionViewWillEnter() {
    this.changeComponent('codigoqr');
  }

  footerClick(button: string) {
    this.changeComponent(button);
  }

  changeComponent(name: string) {
    this.selectedComponent = name;
    this.footer.selectedButton = name;
  }

  webQrScanned(asistencia: Asistencia) {
    this.asistencia = asistencia;
    this.changeComponent('mi-clase'); // Cambia a "mi-clase" sin cambiar la URL
  }

  webQrStopped() {
    console.log('Escaneo detenido');
  }

  headerClick(event: any) {
    console.log('Header clicked:', event);
  }
}