import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { NivelEducacional } from '../models/nivel-educacional.model'; // Asegúrate de que la ruta sea correcta
import { Usuario } from '../models/usuario.model'; // Asegúrate de que la ruta sea correcta

@Injectable({
  providedIn: 'root',
})
export class DatabaseInitializerService {
  constructor(private databaseService: DatabaseService) {}

  public async init() {
    await this.databaseService.initDatabase();
    console.log('Base de datos inicializada correctamente');

    await this.inicializarNivelesEducacionales();
    await this.inicializarUsuarios();
  
  }

  
  public getDatabaseService(): DatabaseService {
    return this.databaseService;
  }


  private async inicializarNivelesEducacionales() {
    const niveles = [
      new NivelEducacional(1, 1, 'Educación Básica'),
      new NivelEducacional(2, 2, 'Educación Media'),
      new NivelEducacional(3, 3, 'Educación Superior'),
      new NivelEducacional(4, 4, 'Postgrado'),
    ];

    for (const nivel of niveles) {
      const result = await this.databaseService.execute(`
        SELECT * FROM nivel_educacional WHERE nivel = ?
      `, [nivel.nivel]);

      if (result && result.rows && result.rows.length === 0) {
        await this.databaseService.execute(`
          INSERT INTO nivel_educacional (nivel, descripcion) VALUES (?, ?)
        `, [nivel.nivel, nivel.descripcion]);
      }
    }
  }

  private async inicializarUsuarios() {
    const usuarios = await this.getListaUsuarios();
    if (usuarios.length === 0) {
      const usuariosIniciales = Usuario.getListaUsuarios();

      for (const usuario of usuariosIniciales) {
        await this.guardarUsuario(usuario);
      }
    }
  }

  private async guardarUsuario(usuario: Usuario): Promise<void> {
    const nivel = await this.getNivelEducacionalId(usuario.nivel);
    await this.databaseService.execute(`
      INSERT INTO usuarios (
        username, email, password, pregunta, respuesta, nombre, apellido, nivel_educacional_id, fecha_nacimiento
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      usuario.username,
      usuario.email,
      usuario.password,
      usuario.pregunta,
      usuario.respuesta,
      usuario.nombre,
      usuario.apellido,
      nivel.id,
      usuario.fechaNacimiento.toISOString(),
    ]);
  }

  private async getListaUsuarios(): Promise<Usuario[]> {
    const usuarios: Usuario[] = [];
    const result = await this.databaseService.execute(`
      SELECT * FROM usuarios
    `, []);

    if (result && result.rows) {
      for (let i = 0; i < result.rows.length; i++) {
        const row = result.rows.item(i);
        const usuario = new Usuario(
          row.id,
          row.username,
          row.email,
          row.password,
          row.pregunta,
          row.respuesta,
          row.nombre,
          row.apellido,
          new NivelEducacional(row.nivel_id, row.nivel, row.descripcion),
          new Date(row.fecha_nacimiento),
        );
        usuarios.push(usuario);
      }
    }

    return usuarios;
  }

  private async getNivelEducacionalId(nivel: NivelEducacional): Promise<NivelEducacional> {
    const result = await this.databaseService.execute(`
      SELECT * FROM nivel_educacional WHERE nivel = ?
    `, [nivel.nivel]);

    if (result && result.rows && result.rows.length > 0) {
      const row = result.rows.item(0);
      return new NivelEducacional(row.id, row.nivel, row.descripcion);
    } else {
      throw new Error(`Nivel educacional no encontrado: ${nivel.nivel}`);
    }
  }
}