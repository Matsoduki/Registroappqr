import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private usuarios: Usuario[] = Usuario.getListaUsuarios(); // Inicializa la lista de usuarios

  // Obtener la lista de usuarios
  getListaUsuarios(): Usuario[] {
    return this.usuarios;
  }

  // Actualizar un usuario en la lista
  updateUsuario(updatedUsuario: Usuario): void {
    const index = this.usuarios.findIndex(usuario => usuario.username === updatedUsuario.username);
    if (index !== -1) {
      this.usuarios[index] = updatedUsuario; // Actualiza el usuario en la lista
    }
  }

  // Obtener un usuario por su username
  getUsuario(username: string): Usuario | undefined {
    return this.usuarios.find(usuario => usuario.username === username);
  }
}