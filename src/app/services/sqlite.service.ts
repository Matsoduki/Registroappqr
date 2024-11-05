import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { 
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
  CapacitorSQLitePlugin,
  capSQLiteUpgradeOptions
} from '@capacitor-community/sqlite';
import { showAlertError } from '../tools/message-functions';

@Injectable({
  providedIn: 'root'
})
export class SQLiteService {
  sqliteConnection!: SQLiteConnection;
  isService: boolean = false;
  platform!: string;
  sqlitePlugin!: CapacitorSQLitePlugin;
  native: boolean = false;
  
  constructor() { }

  async initializePlugin(): Promise<boolean> {
    try {
      this.platform = Capacitor.getPlatform();
      this.native = this.platform === 'ios' || this.platform === 'android';
      this.sqlitePlugin = CapacitorSQLite;
      this.sqliteConnection = new SQLiteConnection(this.sqlitePlugin);
      this.isService = true;
      return true;
    } catch (error) {
      const errorMessage = showAlertError('SQLiteService.initializePlugin', error);
      return Promise.reject(errorMessage);
    }
  }

  async initializeWebStore(): Promise<void> {
    try {
      await this.sqliteConnection.initWebStore();
    } catch (error) {
      const errorMessage = showAlertError('SQLiteService.initializeWebStore', error);
      return Promise.reject(errorMessage);
    }
  }
  
  async open(dbName: string, encrypted: boolean, mode: string, version: number
        , readonly: boolean): Promise<SQLiteDBConnection> 
  {
    try {
      const isConsistent = (await this.sqliteConnection.checkConnectionsConsistency()).result;
      const isConnected = (await this.sqliteConnection.isConnection(dbName, readonly)).result;
    
      const db = isConsistent && isConnected
        ? await this.sqliteConnection.retrieveConnection(dbName, readonly)
        : await this.sqliteConnection.createConnection(dbName, encrypted, mode, version, readonly);
    
      await db.open();
      return db;
    } catch (error) {
      return Promise.reject(await showAlertError('SQLiteService.open', error));
    }
  }

  async retrieveConnection(dbName: string, readonly: boolean): Promise<SQLiteDBConnection> {
    try {
      return await this.sqliteConnection.retrieveConnection(dbName, readonly);
    } catch (error) {
      return Promise.reject(await showAlertError('SQLiteService.retrieveConnection', error));
    }
  }
  
  async closeConnection(database: string, readonly: boolean = false): Promise<void> {
    try {
      await this.sqliteConnection.closeConnection(database, readonly);
    } catch (error) {
      const errorMessage = showAlertError('SQLiteService.closeConnection', error);
      return Promise.reject(errorMessage);
    }
  }
  
  async createDataBase(options: capSQLiteUpgradeOptions): Promise<void> {
    try {
      await this.sqlitePlugin.addUpgradeStatement(options);
    } catch (error) {
      const errorMessage = showAlertError('SQLiteService.createDataBase', error);
      return Promise.reject(errorMessage);
    }
  }
  
  async saveDataBaseNameToStore(dbName: string): Promise<void> {
    try {
      await this.sqliteConnection.saveToStore(dbName);
    } catch (error) {
      const errorMessage = showAlertError('SQLiteService.saveDataBaseNameToStore', error);
      return Promise.reject(errorMessage);
    }
  }
  
  async deleteDataBase(dbName: string): Promise<void> {
    try {
      await this.sqlitePlugin.deleteDatabase({ database: dbName });
    } catch (error) {
      const errorMessage = showAlertError('SQLiteService.deleteDataBase', error);
      return Promise.reject(errorMessage);
    }
  }
  
}
