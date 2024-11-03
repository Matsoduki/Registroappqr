import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AnimationController } from '@ionic/angular';
import { Usuario } from '../models/usuario.model';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.page.html',
  styleUrls: ['./ingreso.page.scss'],
})
export class IngresoPage implements AfterViewInit {
  username: string = '';
  password: string = '';
  usuarios: Usuario[] = Usuario.getListaUsuarios();

  @ViewChild('recuperar', { read: ElementRef }) itemRecuperar!: ElementRef;

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private animationCtrl: AnimationController
  ) {}

  ngAfterViewInit() {
    this.animRecuperarCont();
  }

  login() {
    const usuarioValido = this.usuarios.find(usuario => usuario.username === this.username && usuario.password === this.password);

    if (usuarioValido) {
      this.navCtrl.navigateForward('/inicio', {
        state: { usuario: usuarioValido }
      });
      this.toastCtrl.create({
        message: '¡Bienvenido(a) al Sistema de Asistencia DuocUC!',
        duration: 2000,
        buttons: [
          {
            text: 'X',
            role: 'cancel'
          }
        ]
      }).then(toast => toast.present());
    } else {
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

  animRecuperarCont() {
    this.animationCtrl
      .create()
      .addElement(this.itemRecuperar.nativeElement)
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