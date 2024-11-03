import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { NivelEducacional } from '../models/nivel-educacional.model';
import { DatabaseInitializerService } from './database-initializer.service';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  constructor(private databaseInitializer: DatabaseInitializerService) {}

  public async guardarUsuario(usuario: Usuario): Promise<void> {
    const nivel = await this.getNivelEducacionalId(usuario.nivel);
    await this.databaseInitializer.getDatabaseService().execute(`
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

  public async getListaUsuarios(): Promise<Usuario[]> {
    const usuarios: Usuario[] = [];
    const result = await this.databaseInitializer.getDatabaseService().execute(`
      SELECT
        u.id, u.username, u.email, u.password, u.pregunta, u.respuesta, u.nombre, u.apellido,
        ne.nivel, ne.descripcion, u.fecha_nacimiento
      FROM usuarios u
      JOIN nivel_educacional ne ON u.nivel_educacional_id = ne.id
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
          new NivelEducacional(row.id, row.nivel, row.descripcion),
          new Date(row.fecha_nacimiento),
        );
        usuarios.push(usuario);
      }
    }

    return usuarios;
  }

  private async getNivelEducacionalId(nivel: NivelEducacional): Promise<NivelEducacional> {
    const result = await this.databaseInitializer.getDatabaseService().execute(`
      SELECT * FROM nivel_educacional WHERE nivel = ?
    `, [nivel.nivel]);

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

    await this.databaseInitializer.getDatabaseService().execute(`
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
      usuario.id,
    ]);
  }
}