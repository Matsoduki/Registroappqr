import { NivelEducacional } from './nivel-educacional';
import { Persona } from "./persona";
import { DatabaseService } from '../services/database.service';
import { inject } from '@angular/core';
import { convertDateToString } from '../tools/date-functions';

export class Usuario extends Persona {

  username = '';
  correo = '';
  password = '';
  fraseSecreta = '';
  respuestaSecreta = '';
  foto = '';

  constructor() {
    super();
  }

  static getNewUsuario(
    username: string,
    correo: string,
    password: string,
    fraseSecreta: string,
    respuestaSecreta: string,
    nombre: string,
    apellido: string,
    nivelEducacional: NivelEducacional,
    fechaDeNacimiento: Date,
    direccion: string,
    foto: string
  ) {
    let usuario = new Usuario();
    usuario.username = username;
    usuario.correo = correo;
    usuario.password = password;
    usuario.fraseSecreta = fraseSecreta;
    usuario.respuestaSecreta = respuestaSecreta;
    usuario.nombre = nombre;
    usuario.apellido = apellido;
    usuario.nivelEducacional = nivelEducacional;
    usuario.fechaDeNacimiento = fechaDeNacimiento;
    usuario.direccion = direccion;
    usuario.foto = foto;
    return usuario;
  }

  override toString(): string {
    return `\n
        Nombre de Usuario: ${this.username}\n
        Correo: ${this.correo}\n
        Contraseña: ${this.password}\n
        Frase Secreta: ${this.fraseSecreta}\n
        Respuesta: ${this.respuestaSecreta}\n
        Nombres: ${this.nombre}\n
        Apellidos: ${this.apellido}\n
        Nivel educacional: ${this.nivelEducacional.getEducacion()}\n
        Fecha de nacimiento: ${convertDateToString(this.fechaDeNacimiento)}\n
        Dirección: ${this.direccion}\n
        Foto: ${this.foto !== ''}\n
      `;
  }

  // Método para validar el correo
  public validarCorreo(): string {
    if (this.correo.trim() === '') {
      return 'Para ingresar al sistema debe ingresar un correo electrónico.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.correo)) {
      return 'El correo ingresado no tiene un formato válido.';
    }
    return '';
  }

  // Método para validar la contraseña
  public validarPassword(): string {
    if (this.password.trim() === '') {
      return 'Para entrar al sistema debe ingresar la contraseña.';
    }
    if (this.password.length < 4) {
      return 'La contraseña debe tener al menos 4 caracteres.';
    }
    return '';
  }

  // Método para validar el nombre de usuario
  public validarUsername(): string {
    if (this.username.trim() === '') {
      return 'El nombre de usuario no puede estar vacío.';
    }
    if (this.username.length < 4) {
      return 'El nombre de usuario debe tener al menos 4 caracteres.';
    }
    return '';
  }

  // Método para validar que nombre y apellido no estén vacíos
  public validarNombreYApellido(): string {
    if (this.nombre.trim() === '' || this.apellido.trim() === '') {
      return 'El nombre y el apellido no pueden estar vacíos.';
    }
    return '';
  }

  // Método para validar la frase y respuesta secreta
  public validarFraseYRespuestaSecreta(): string {
    if (this.fraseSecreta.trim() === '' || this.respuestaSecreta.trim() === '') {
      return 'La frase secreta y la respuesta no pueden estar vacías.';
    }
    return '';
  }
}