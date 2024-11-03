import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private database!: SQLiteDBConnection;

  constructor() {
    this.initDatabase().catch(err => console.error('Error inicializando la base de datos:', err));
  }

  private async initDatabase() {
    this.database = await new SQLiteConnection(CapacitorSQLite).createConnection('usuarios.db', false, 'no-encryption', 1, false);
    await this.database.open();
  }

  public async execute(query: string, params?: any[]): Promise<any> {
    try {
      const result = await this.database.run(query, params);
      return result;
    } catch (error) {
      console.error('Error ejecutando la consulta:', error);
      throw error; // Re-lanza el error para que pueda ser manejado fuera
    }
  }
}