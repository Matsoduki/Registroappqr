import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Usuario } from '../models/usuario.model';

@Component({
  selector: 'app-correo',
  templateUrl: './correo.page.html',
  styleUrls: ['./correo.page.scss'],
})
export class CorreoPage {
  email: string = '';
  errorMessage: string | null = null;

  constructor(private navCtrl: NavController) {}

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
    }
  }
}