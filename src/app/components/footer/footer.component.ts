import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonFooter, IonToolbar, IonSegment, IonSegmentButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, pencilOutline, qrCodeOutline, personOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/model/usuario';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [
      CommonModule,
      FormsModule,
      TranslateModule,
      IonFooter,
      IonToolbar,
      IonSegment,
      IonSegmentButton,
      IonIcon
  ]
})
export class FooterComponent {
  selectedComponent = 'codigoqr';

  usuario = new Usuario();
  private authUserSubs!: Subscription;
  
  constructor(private auth: AuthService) { 
    addIcons({homeOutline,qrCodeOutline,pencilOutline,personOutline});
  }

  ngOnInit() {
    // Sincroniza `usuario` desde el servicio de autenticación
    this.authUserSubs = this.auth.authUser.subscribe((usuario) => {
      this.usuario = usuario ?? new Usuario();
    });
  
    // Sincroniza `selectedComponent` con `AuthService`
    this.auth.selectedComponent.subscribe((selectedComponent) => {
      this.selectedComponent = selectedComponent;
    });
  }

  segmentChanged(selectedComponent: string) {
    this.auth.selectedComponent.next(selectedComponent);
  }
}