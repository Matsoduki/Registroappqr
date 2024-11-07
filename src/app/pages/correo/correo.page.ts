import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageComponent } from 'src/app/components/language/language.component';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/model/usuario';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-correo',
  templateUrl: './correo.page.html',
  styleUrls: ['./correo.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    LanguageComponent
  ]
})
export class CorreoPage {
  correo: string = '';
  errorMessage: string | null = null;

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private databaseService: DatabaseService,
    private router: Router
  ) {}

  async recuperarPassword() {
    // Validación para verificar si el campo de correo está vacío
    if (!this.correo) {
        await this.mostrarToast('Por favor, ingresa tu correo electrónico.');
        return; // Sale del método si el campo está vacío
    }

    console.log('Correo ingresado:', this.correo); // Debugging

    try {
        // Utiliza DatabaseService para buscar el usuario por correo
        const usuarioValido = await this.databaseService.findUserByCorreo(this.correo);

        // Verifica si el usuario encontrado tiene datos válidos
        if (usuarioValido && usuarioValido.username) {
            console.log('Usuario encontrado:', usuarioValido); // Debugging
            this.navCtrl.navigateForward('/pregunta', {
                state: { username: usuarioValido.username }
            });
        } else {
            // Redirige a la página incorrecto si no se encuentra el usuario o si los datos son inválidos
            console.log('Correo electrónico no encontrado o usuario inválido.'); // Debugging
            this.router.navigate(['/incorrecto']);
        }
    } catch (error) {
        console.error('Error al recuperar el usuario:', error);
        // Manejo de error: redirigir a la página incorrecto
        this.router.navigate(['/incorrecto']);
    }
}

// Función auxiliar para mostrar toasts
private async mostrarToast(mensaje: string) {
    const toast = await this.toastCtrl.create({
        message: mensaje,
        duration: 2000,
        color: 'danger',
        buttons: [
            {
                text: 'X',
                role: 'cancel'
            }
        ]
    });
    await toast.present();
}

  ingreso() {
    this.router.navigate(['/ingreso']);
  }
}
