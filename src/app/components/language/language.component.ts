import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
  standalone: true,
  imports: [
      CommonModule    // CGV-Permite usar directivas comunes de Angular
    , FormsModule     // CGV-Permite usar formularios
    , IonicModule     // CGV-Permite usar componentes de Ionic como IonContent, IonItem, etc.
    , TranslateModule // CGV-Permite usar pipe 'translate'
  ]
})
export class LanguageComponent {

  @Output() changeCurrentLanguage = new EventEmitter();

  languageSelected = "es";

  constructor(private translate: TranslateService) { 
    this.translate.use('es');
  }

  setCurrentLanguage() {
    this.languageSelected = this.translate.currentLang;
  }

  changeLanguage(value: string) {
    this.translate.use(value);
    this.changeCurrentLanguage.emit(value);
  }

}
