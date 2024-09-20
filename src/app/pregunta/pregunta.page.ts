import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';

@Component({
  selector: 'app-pregunta',
  templateUrl: './pregunta.page.html',
  styleUrls: ['./pregunta.page.scss'],
})
export class PreguntaPage {
  username: string = '';
  respuesta: string = '';
  errorMessage: string | null = null;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.username = navigation.extras.state['username'] || ''; // Acceso con corchetes
    }
  }

  verificarRespuesta() {
    const usuarios = Usuario.getListaUsuarios();
    const usuarioValido = usuarios.find(usuario => usuario.username === this.username);

    if (usuarioValido && usuarioValido.respuesta === this.respuesta) {
      this.router.navigate(['/correcto']); // Navega a página de éxito
    } else {
      this.errorMessage = 'Respuesta incorrecta.';
      this.router.navigate(['/incorrecto']); // Navega a página de error
    }
  }
}