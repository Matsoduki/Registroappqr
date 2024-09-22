import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AnimationController } from '@ionic/angular';
import { Usuario } from '../models/usuario.model';

@Component({
  selector: 'app-correo',
  templateUrl: './correo.page.html',
  styleUrls: ['./correo.page.scss'],
})
export class CorreoPage implements AfterViewInit {
  email: string = '';
  errorMessage: string | null = null;

  @ViewChild('ingresar', { read: ElementRef }) itemIngresar!: ElementRef;

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private animationCtrl: AnimationController
  ) {}

  ngAfterViewInit() {
    this.animIngresarCont();
  }

  recuperarContrasena() {
    console.log('Correo ingresado:', this.email); // Debugging
    const usuarios = Usuario.getListaUsuarios(); // Obtiene la lista de usuarios
    const usuarioValido = usuarios.find(usuario => usuario.email === this.email); // Busca el usuario por email
  
    if (usuarioValido) {
      console.log('Usuario encontrado:', usuarioValido); // Debugging
      this.navCtrl.navigateForward('/pregunta', {
        state: { username: usuarioValido.username }
      });
    } else {
      this.errorMessage = 'Correo electronico no encontrado.'; // Mensaje de error
      console.log(this.errorMessage); // Debugging
      this.toastCtrl.create({
        message: 'Credenciales incorrectas. Por favor, inténtelo de nuevo.',
        duration: 2000,
        color: 'danger',
        buttons: [
          {
            text: 'X',
            role: 'cancel'
          }
        ]
      }).then(toast => toast.present());
    }
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
}