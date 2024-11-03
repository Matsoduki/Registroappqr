import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';


@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private database: SQLiteDBConnection | undefined;

  // Constructor sin inicialización
  constructor() {}

  public async initDatabase() {
    try {
      this.database = await new SQLiteConnection(CapacitorSQLite).createConnection('usuarios.db', false, 'no-encryption', 1, true);
      await this.database.open();
      console.log('Base de datos abierta correctamente');
    } catch (error) {
      console.error('Error al abrir la base de datos:', error);
    }
  }

  public async execute(query: string, params?: any[]): Promise<any> {
    if (!this.database) {
      throw new Error('Database connection is not initialized');
    }
    try {
      const result = await this.database.run(query, params);
      return result;
    } catch (error) {
      console.error('Error al ejecutar la consulta:', error);
      throw error; // Re-lanza el error para que pueda ser manejado fuera
    }
  }
}