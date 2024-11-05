import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AnimationController } from '@ionic/angular';
import { Usuario } from '../models/usuario.model';

@Component({
  selector: 'app-pregunta',
  templateUrl: './pregunta.page.html',
  styleUrls: ['./pregunta.page.scss'],
})
export class PreguntaPage implements AfterViewInit {
  username: string = '';
  respuesta: string = '';
  errorMessage: string | null = null;
  
  // Variables para almacenar el nombre, apellido y pregunta secreta
  nombre: string = '';
  apellido: string = '';
  preguntaSecreta: string = '';

  @ViewChild('ingresar', { read: ElementRef }) itemIngresar!: ElementRef;

  constructor(private router: Router, private toastCtrl: ToastController, private animationCtrl: AnimationController) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.username = navigation.extras.state['username'] || ''; // Acceso con corchetes
    }
    
    // Cargar datos del usuario
    this.cargarDatosUsuario();
  }

  ngAfterViewInit() {
    this.animIngresarCont();
  }

  // Función para cargar los datos del usuario (nombre, apellido, pregunta secreta)
  cargarDatosUsuario() {
    const usuarios = Usuario.getListaUsuarios();
    const usuarioValido = usuarios.find(usuario => usuario.username === this.username);

    if (usuarioValido) {
      this.nombre = usuarioValido.nombre;
      this.apellido = usuarioValido.apellido;
      this.preguntaSecreta = usuarioValido.pregunta; // Pregunta secreta
    } else {
      this.errorMessage = 'Usuario no encontrado.';
    }
  }

  verificarRespuesta() {
    const usuarios = Usuario.getListaUsuarios();
    const usuarioValido = usuarios.find(usuario => usuario.username === this.username);

    if (usuarioValido && usuarioValido.respuesta === this.respuesta) {
      this.router.navigate(['/correcto'], {state: { username: usuarioValido.username }}); // Navega a página de éxito
    } else {
      this.errorMessage = 'Respuesta incorrecta.';
      this.router.navigate(['/incorrecto']); // Navega a página de error
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
