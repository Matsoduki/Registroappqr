import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageComponent } from 'src/app/components/language/language.component';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AnimationController } from '@ionic/angular';
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
export class CorreoPage implements AfterViewInit {
  correo: string = '';
  errorMessage: string | null = null;

  @ViewChild('ingresar', { read: ElementRef }) itemIngresar!: ElementRef;

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private animationCtrl: AnimationController,
    private databaseService: DatabaseService,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.animIngresarCont();
  }
  
  async recuperarPassword() {
    console.log('Correo ingresado:', this.correo); // Debugging

    try {
        // Utiliza DatabaseService para buscar el usuario por correo
        const usuarioValido = await this.databaseService.findUserByCorreo(this.correo);

        if (usuarioValido) {
            console.log('Usuario encontrado:', usuarioValido); // Debugging
            this.navCtrl.navigateForward('/pregunta', {
                state: { username: usuarioValido.username }
            });
        } else {
            // Manejo de caso cuando el usuario es undefined
            this.errorMessage = 'Correo electrónico no encontrado.'; // Mensaje de error
            console.log(this.errorMessage); // Debugging

            // Mostrar un toast para el error
            await this.mostrarToast('Credenciales incorrectas. Por favor, inténtelo de nuevo.');
        }
    } catch (error) {
        console.error('Error al recuperar el usuario:', error);
        // Mostrar un toast para el error de búsqueda
        await this.mostrarToast('Ocurrió un error al buscar el usuario. Por favor, inténtelo de nuevo.');
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


  animIngresarCont() {
    this.animationCtrl
      .create()
      .addElement(this.itemIngresar.nativeElement)
      .iterations(Infinity)
      .duration(6000)
      .keyframes([
        { offset: 0, transform: 'scaleX(1)' },
        { offset: 0.5, transform: 'scaleX(1.05)' },
        { offset: 1, transform: 'scaleX(1)' }
      ])
      .easing('ease-in-out')
      .play();
  }

  ingreso() {
    this.router.navigate(['/ingreso']);
  }
}
