import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { arrowBackOutline, homeOutline, logOutOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-temas',
  templateUrl: './temas.page.html',
  styleUrls: ['./temas.page.scss'],
  standalone: true,
  imports: [
      CommonModule            // CGV-Permite usar directivas comunes de Angular
    , FormsModule             // CGV-Permite usar formularios
    , IonicModule             // CGV-Permite usar componentes de Ionic como IonContent, IonItem, etc.
    , TranslateModule         // CGV-Permite usar pipe 'translate'
  ]
})
export class TemasPage {

  colorTheme: string = '';

  constructor(private navCtrl: NavController) { 
    this.colorTheme = 'dark';
    document.body.setAttribute('color-theme', this.colorTheme);
    addIcons({ homeOutline, logOutOutline, arrowBackOutline });
  }

  changeTheme(event: any) {
    this.colorTheme = event.detail.value;
    document.body.setAttribute('color-theme', this.colorTheme);
  }

  goBack() {
    this.navCtrl.back();
  }

}

