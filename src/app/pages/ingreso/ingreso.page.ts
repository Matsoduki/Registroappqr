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
import { ToastController } from '@ionic/angular'; // Importar para mostrar mensajes

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
    private authService: AuthService,
    private toastController: ToastController // Inyectar ToastController
  ) {
    this.correo = '';
    this.password = '';
    addIcons({ colorWandOutline });
  }

  async ionViewWillEnter() {
    this.selectLanguage.setCurrentLanguage();
  }

  navigateTheme() {
    this.router.navigate(['/temas']);
  }

  async login() {
    if (this.correo && this.password) {
      try {
        const result = await this.authService.login(this.correo, this.password);
        if (result) {
          // Redirigir a la página principal o dashboard
          this.router.navigate(['/inicio']);
        }
      } catch (error) {
        if (error instanceof TypeError) {
          this.showToast('Error de tipo. Revisa tu conexión o datos.');
        } else if (error instanceof RangeError) {
          this.showToast('Error de rango. Intenta con otros datos.');
        } else {
          this.showToast('Error al iniciar sesión. Intenta de nuevo más tarde.');
        }
      }
    } else {
      this.showToast('Por favor, completa todos los campos.');
    }
  }

  passwordRecovery() {
    this.router.navigate(['/correo']);
  }

  miruta() {
    this.router.navigate(['/miruta']);
  }

  registro() {
    this.router.navigate(['/registrarme']);
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
}