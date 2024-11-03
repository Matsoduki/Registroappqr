import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';
import { Usuario } from '../models/usuario.model';

@Component({
  selector: 'app-correcto',
  templateUrl: './correcto.page.html',
  styleUrls: ['./correcto.page.scss'],
})
export class CorrectoPage implements AfterViewInit {
  password: string = '';  // Aquí se mostrará la contraseña del usuario
  username: string = '';  // Variable para capturar el username que viene en el state
  errorMessage: string | null = null;

  @ViewChild('ingresar', { read: ElementRef }) itemIngresar!: ElementRef;

  constructor(
    private router: Router,
    private animationCtrl: AnimationController
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.username = navigation.extras.state['username'] || ''; // Capturamos el username en lugar de la contraseña
    }

    this.cargarDatosUsuario();
  }

  ngAfterViewInit() {
    this.animIngresarCont();
  }

  cargarDatosUsuario() {
    const usuarios = Usuario.getListaUsuarios();
    const usuarioValido = usuarios.find(usuario => usuario.username === this.username); // Buscamos el usuario por el username

    if (usuarioValido) {
      this.password = usuarioValido.password; // Asignamos la contraseña del usuario encontrado
    } else {
      this.errorMessage = 'Usuario no encontrado.';
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
