import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ViewWillEnter } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageComponent } from 'src/app/components/language/language.component';
import { Router } from '@angular/router';
import { colorWandOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.page.html',
  styleUrls: ['./ingreso.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    LanguageComponent
  ]
})
export class IngresoPage implements ViewWillEnter {

  @ViewChild('selectLanguage') selectLanguage!: LanguageComponent;

  correo: string;
  password: string;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private authService: AuthService
  ) {
    this.correo = 'atorres';
    this.password = '1234';
    addIcons({ colorWandOutline });
  }

  async ionViewWillEnter() {
    this.selectLanguage.setCurrentLanguage();
  }

  navigateTheme() {
    this.router.navigate(['/temas']);
  }

  login() {
    this.authService.login(this.correo, this.password);
  }

  passwordRecovery() {
    this.router.navigate(['/correo']);
  }

  map() {
    
  }
}
