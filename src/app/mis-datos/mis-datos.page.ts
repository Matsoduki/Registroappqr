import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../models/usuario.model';
import { NivelEducacional } from '../models/nivel-educacional.model';

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.page.html',
  styleUrls: ['./mis-datos.page.scss'],
})
export class MisDatosPage {
  usuario: Usuario;
  repetirPassword: string = '';
  mensajeExito: string | null = null;
  mensajeError: string | null = null;

  constructor(private router: Router, private usuarioService: UsuarioService) {
    const navigation = this.router.getCurrentNavigation();
    this.usuario = navigation?.extras.state ? navigation.extras.state['usuario'] : null;
  
    if (!this.usuario) {
      console.error('No se recibieron datos del usuario');
      this.router.navigate(['/inicio']); // Redirigir si no hay usuario
    }
  }

  actualizarDatos() {
    // Verificar que las contraseñas coincidan
    if (this.usuario.password !== this.repetirPassword) {
      this.mensajeError = 'Las contraseñas no coinciden.';
      this.mensajeExito = null; // Limpiar mensaje de éxito
      return;
    }

    // Actualiza el usuario en el servicio
    this.usuarioService.updateUsuario(this.usuario);
    this.mensajeExito = 'Datos actualizados correctamente!';
    this.mensajeError = null; // Limpiar mensaje de error
  }

  cerrarSesion() {
    this.router.navigate(['/ingreso'], {
      state: { usuario: this.usuario }
    });
  }
}