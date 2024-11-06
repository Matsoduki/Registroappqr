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
  // db = inject(DatabaseService);
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

  // async findUser(username: string, password: string): Promise<Usuario | undefined> {
  //   return await this.db.findUser(username, password);
  // }

  // async findByUsername(username: string): Promise<Usuario | undefined>  {
  //   return await this.db.findUserByUsername(username);
  // }

  // async findUserByCorreo(correo: string): Promise<Usuario | undefined>  {
  //   return await this.db.findUserByCorreo(correo);
  // }

  // async save(): Promise<void> {
  //   this.db.saveUser(this);
  // }

  // async delete(username: string): Promise<void>  {
  //   this.db.deleteByUsername(username);
  // }

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

}