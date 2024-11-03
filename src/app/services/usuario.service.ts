import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { NivelEducacional } from '../models/nivel-educacional.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private usuarios: Usuario[];

  constructor() {
    this.usuarios = this.cargarUsuarios(); // Cargar usuarios desde localStorage
  }

  private cargarUsuarios(): Usuario[] {
    const usuariosGuardados = localStorage.getItem('usuarios');
    return usuariosGuardados ? JSON.parse(usuariosGuardados) : this.inicializarUsuarios();
  }

  private inicializarUsuarios(): Usuario[] {
    const usuarios = [
      new Usuario('atorres', 'atorres@duocuc.cl', '1234', '¿Cuál es tu animal favorito?', 'gato', 'Ana', 'Torres', new NivelEducacional(3, 'Educación Superior'), new Date(2000, 0, 1)),
      new Usuario('jperez', 'jperez@duocuc.cl', '5678', '¿Cuál es tu postre favorito?', 'panqueques', 'Juan', 'Pérez', new NivelEducacional(3, 'Educación Superior'), new Date(2000, 1, 1)),
      new Usuario('cmujica', 'cmujica@duocuc.cl', '0987', '¿Cuál es tu vehículo favorito?', 'moto', 'Carla', 'Mujica', new NivelEducacional(4, 'Postgrado'), new Date(2000, 2, 1))
    ];
    localStorage.setItem('usuarios', JSON.stringify(usuarios)); // Guardar los usuarios iniciales
    return usuarios;
  }

  public guardarUsuarios(): void {
    localStorage.setItem('usuarios', JSON.stringify(this.usuarios)); // Guardar usuarios en localStorage
  }

  // Obtener la lista de usuarios
  getListaUsuarios(): Usuario[] {
    return this.usuarios;
  }

  updateUsuario(updatedUsuario: Usuario): void {
    const index = this.usuarios.findIndex(usuario => usuario.username === updatedUsuario.username);
    if (index !== -1) {
      // Actualiza el usuario en la lista
      this.usuarios[index] = updatedUsuario; 
      this.guardarUsuarios(); // Guardar los cambios en localStorage
    } else {
      console.error('Usuario no encontrado para actualizar:', updatedUsuario.username);
    }
  }

  // Obtener un usuario por su username
  getUsuario(username: string): Usuario | undefined {
    return this.usuarios.find(usuario => usuario.username === username);
  }

  
}