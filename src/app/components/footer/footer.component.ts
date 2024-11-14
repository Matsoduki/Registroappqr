import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonFooter, IonToolbar, IonSegment, IonSegmentButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, pencilOutline, qrCodeOutline, personOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';

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

  constructor(private auth: AuthService) { 
    addIcons({homeOutline,qrCodeOutline,pencilOutline,personOutline});
  }

  segmentChanged(selectedComponent: string) {
    this.selectedComponent = selectedComponent;
    this.auth.selectedComponent.next(this.selectedComponent);
  }
}