import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { logOutOutline, qrCodeOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { AuthService } from 'src/app/services/auth.service';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
      CommonModule    // CGV-Permite usar directivas comunes de Angular
    , FormsModule     // CGV-Permite usar formularios
    , IonicModule     // CGV-Permite usar componentes de Ionic como IonContent, IonItem, etc.
    , TranslateModule // CGV-Permite usar pipe 'translate'
  ]
})
export class HeaderComponent implements AfterViewInit {
  
  @ViewChild('titulo', { read: ElementRef }) itemTitulo!: ElementRef;
  @Output() headerClick = new EventEmitter<string>();

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private animationController: AnimationController
  ) { 
    addIcons({ logOutOutline, qrCodeOutline });
  }

  ngAfterViewInit() {
    this.animarTituloIzqDer();
  }

  animarTituloIzqDer() {
    this.animationController
      .create()
      .addElement(this.itemTitulo.nativeElement)
      .iterations(Infinity)
      .duration(8000) // Cambia la duración a 6000 milisegundos para que sea más rápida
      .fromTo('transform', 'translate(-500%)', 'translate(1000%)') // Cambia a -100% para que empiece desde fuera de la pantalla
      .fromTo('opacity', 1, 0)
      .play();
  }

  sendClickEvent(buttonName: string) {
    this.headerClick.emit(buttonName);
  }

  logout() {
    this.authService.logout();
  }

}
