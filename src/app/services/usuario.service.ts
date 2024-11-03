import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { NivelEducacional } from '../models/nivel-educacional.model';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private database!: SQLiteObject;

  constructor(
    private sqlite: SQLite,
    private platform: Platform,
    private http: HttpClient
  ) {
    this.initDatabase();
  }

  private async initDatabase() {
    await this.platform.ready();
    this.database = await this.sqlite.create({
      name: 'usuarios.db',
      location: 'default'
    });
    await this.createTables();
    await this.inicializarNivelesEducacionales();
    await this.inicializarUsuarios();
  }

  private async createTables() {
    try {
      const sql = await lastValueFrom(this.http.get('assets/sql/create-tables.sql', { responseType: 'text' }));
      await this.database.executeSql(sql, []);
    } catch (error) {
      console.error('Error al crear tablas:', error);
    }
  }

  private async inicializarNivelesEducacionales() {
    const niveles = [
      new NivelEducacional(1, 1, 'Educación Básica'),
      new NivelEducacional(2, 2, 'Educación Media'),
      new NivelEducacional(3, 3, 'Educación Superior'),
      new NivelEducacional(4, 4, 'Postgrado')
    ];
  
    for (const nivel of niveles) {
      const result = await this.database.executeSql(`
        SELECT * FROM nivel_educacional WHERE nivel = ?
      `, [nivel.nivel]);
  
      if (result.rows.length === 0) {
        await this.database.executeSql(`
          INSERT INTO nivel_educacional (nivel, descripcion) VALUES (?, ?)
        `, [nivel.nivel, nivel.descripcion]);
      }
    }
  }

    private async inicializarUsuarios() {
      const usuarios = await this.getListaUsuarios();
      if (usuarios.length === 0) {
        const usuariosIniciales = [
          new Usuario(null, 'atorres', 'atorres@duocuc.cl', '1234', '¿Cuál es tu animal favorito?', 'gato', 'Ana', 'Torres', new NivelEducacional(1, 1, 'Educación Superior'), new Date(2000, 0, 1)),
          new Usuario(null, 'jperez', 'jperez@duocuc.cl', '5678', '¿Cuál es tu postre favorito?', 'panqueques', 'Juan', 'Pérez', new NivelEducacional(2, 2, 'Educación Superior'), new Date(2000, 1, 1)),
          new Usuario(null, 'cmujica', 'cmujica@duocuc.cl', '0987', '¿Cuál es tu vehículo favorito?', 'moto', 'Carla', 'Mujica', new NivelEducacional(4, 4, 'Postgrado'), new Date(2000, 2, 1))
        ];
    
        for (const usuario of usuariosIniciales) {
          await this.guardarUsuario(usuario);
        }
      }
    }

  public async guardarUsuario(usuario: Usuario): Promise<void> {
    const nivel = await this.getNivelEducacionalId(usuario.nivel);
    await this.database.executeSql(`
      INSERT INTO usuarios (
        username, email, password, pregunta, respuesta, nombre, apellido, nivel_educacional_id, fecha_nacimiento
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      usuario.username, usuario.email, usuario.password, usuario.pregunta, usuario.respuesta,
      usuario.nombre, usuario.apellido, nivel.nivel, usuario.fechaNacimiento.toISOString()
    ]);
  }

  public async getListaUsuarios(): Promise<Usuario[]> {
    const usuarios: Usuario[] = [];
    const result = await this.database.executeSql(`
      SELECT
        u.id, u.username, u.email, u.password, u.pregunta, u.respuesta, u.nombre, u.apellido,
        ne.nivel, ne.descripcion
      FROM usuarios u
      JOIN nivel_educacional ne ON u.nivel_educacional_id = ne.id
    `, []);
  
    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows.item(i);
      const usuario = new Usuario(
        row.id, row.username, row.email, row.password, row.pregunta, row.respuesta,
        row.nombre, row.apellido, new NivelEducacional(row.id, row.nivel, row.descripcion),
        new Date(row.fecha_nacimiento)
      );
      usuarios.push(usuario);
    }
  
    return usuarios;
  }

  private async getNivelEducacionalId(nivel: NivelEducacional): Promise<NivelEducacional> {
    const result = await this.database.executeSql(`
      SELECT * FROM nivel_educacional WHERE nivel = ?
    `, [nivel.nivel]);
  
    if (result.rows.length > 0) {
      const row = result.rows.item(0);
      return new NivelEducacional(row.id, row.nivel, row.descripcion); // Usa 'row.id'
    } else {
      throw new Error(`Nivel educacional no encontrado: ${nivel.nivel}`);
    }
  }

  public async updateUsuario(usuario: Usuario): Promise<void> {
    if (!usuario.id) {
        throw new Error('El ID del usuario no puede ser nulo');
    }

    const nivelId = usuario.nivel.id; // Asegúrate de que 'nivel' tenga la propiedad 'id'
    
    await this.database.executeSql(`
      UPDATE usuarios SET 
        email = ?, 
        password = ?, 
        pregunta = ?, 
        respuesta = ?, 
        nombre = ?, 
        apellido = ?, 
        nivel_educacional_id = ?, 
        fecha_nacimiento = ? 
      WHERE id = ?
    `, [
      usuario.email, 
      usuario.password, 
      usuario.pregunta, 
      usuario.respuesta, 
      usuario.nombre, 
      usuario.apellido, 
      nivelId, 
      usuario.fechaNacimiento.toISOString(), 
      usuario.id
    ]);
}
  
}

