import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Usuario } from '../models/usuario.model';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.page.html',
  styleUrls: ['./ingreso.page.scss'],
})
export class IngresoPage {
  username: string = ''; // Inicialización
  password: string = ''; // Inicialización
  usuarios: Usuario[] = Usuario.getListaUsuarios();

  constructor(private navCtrl: NavController) {}

  login() {
    const usuarioValido = this.usuarios.find(usuario => usuario.username === this.username && usuario.password === this.password);

    if (usuarioValido) {
      this.navCtrl.navigateForward('/inicio', {
        state: { usuario: usuarioValido }
      });
    } else {
      console.error('Credenciales incorrectas');
    }
  }
}