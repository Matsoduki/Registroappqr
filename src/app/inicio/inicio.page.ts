import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage {
  usuario: Usuario;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.usuario = navigation?.extras.state ? navigation.extras.state['usuario'] : null;

    if (!this.usuario) {
      console.error('No se recibieron datos del usuario');
      // Maneja el caso donde no hay usuario
    }
  }

  irAMisDatos() {
    console.log('Navegando a Mis Datos con usuario:', this.usuario);
    this.router.navigate(['/mis-datos'], {
      state: { usuario: this.usuario }
      
    });
  }
}