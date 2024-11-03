import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { NivelEducacional } from '../models/nivel-educacional.model';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection, capSQLiteResult } from '@capacitor-community/sqlite';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private database!: SQLiteDBConnection;

  constructor(
    private platform: Platform,
    private http: HttpClient
  ) {
    this.initDatabase().catch(err => console.error('Error inicializando la base de datos:', err));
  }

  private async initDatabase() {
    await this.platform.ready();
    this.database = await new SQLiteConnection(CapacitorSQLite).createConnection('usuarios.db', false, 'no-encryption', 1, false);
    await this.database.open();
    await this.createTables();
    await this.inicializarNivelesEducacionales();
    await this.inicializarUsuarios();
  }

  private async createTables() {
    try {
      const sql = await lastValueFrom(this.http.get('assets/sql/create-tables.sql', { responseType: 'text' }));
      await this.database.execute(sql, [] as any);
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
      const result = await this.database.execute(`
        SELECT * FROM nivel_educacional WHERE nivel = ?
      `, [nivel.nivel]) as any; // Manteniendo 'as any'

      if (result && result.rows && result.rows.length === 0) {
        await this.database.execute(`
          INSERT INTO nivel_educacional (nivel, descripcion) VALUES (?, ?)
        `, [nivel.nivel, nivel.descripcion] as any); // Manteniendo 'as any'
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

  public async guardarUsuario(usuario: Usuario): Promise<void> {
    const nivel = await this.getNivelEducacionalId(usuario.nivel);
    await this.database.execute(`
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
      usuario.fechaNacimiento.toISOString()
    ] as any); // Manteniendo 'as any'
  }

  public async getListaUsuarios(): Promise<Usuario[]> {
    const usuarios: Usuario[] = [];
    const result = await this.database.execute(`
      SELECT
        u.id, u.username, u.email, u.password, u.pregunta, u.respuesta, u.nombre, u.apellido,
        ne.nivel, ne.descripcion, u.fecha_nacimiento
      FROM usuarios u
      JOIN nivel_educacional ne ON u.nivel_educacional_id = ne.id
    `, []) as any; // Manteniendo 'as any'

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
          new NivelEducacional(row.id, row.nivel, row.descripcion),
          new Date(row.fecha_nacimiento)
        );
        usuarios.push(usuario);
      }
    }
    
    return usuarios;
  }

  private async getNivelEducacionalId(nivel: NivelEducacional): Promise<NivelEducacional> {
    const result = await this.database.execute(`
      SELECT * FROM nivel_educacional WHERE nivel = ?
    `, [nivel.nivel]) as any; // Manteniendo 'as any'

    if (result && result.rows && result.rows.length > 0) {
      const row = result.rows.item(0);
      return new NivelEducacional(row.id, row.nivel, row.descripcion);
    } else {
      throw new Error(`Nivel educacional no encontrado: ${nivel.nivel}`);
    }
  }

  public async updateUsuario(usuario: Usuario): Promise<void> {
    if (!usuario.id) {
      throw new Error('El ID del usuario no puede ser nulo');
    }

    const nivelId = usuario.nivel.id;

    await this.database.execute(`
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
    ] as any); // Manteniendo 'as any'
  }
}