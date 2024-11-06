import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { SQLiteService } from './sqlite.service';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class InitializeService {
  isAppInit: boolean = false;
  platform: string = '';

  constructor(
    private sqliteService: SQLiteService,
    private storageService: DatabaseService,
    private authService: AuthService) { }

  async inicializarAplicacion() {
    // Inicializar plugin de SQLite
    await this.sqliteService.initializePlugin().then(async (ret) => {
      this.platform = this.sqliteService.platform;
      try {
        // Si la App está siendo ejecutada en un browser, se debe inicializar el 
        // almacenamiento de la base de datos en el navegador.
        if( this.sqliteService.platform === 'web') {
          await this.sqliteService.initializeWebStore();
        }
        // Inicializar la base de datos del sistema en SQLite. La base de datos
        await this.storageService.initializeDataBase();
        // if( this.sqliteService.platform === 'web') {
        //   await this.sqliteService.guardarNombreBaseDeDatos();
        // }
        // Inicializar servicio de autenticación
        this.authService.initializeAuthService();
        this.isAppInit = true;
      } catch (error) {
        console.log(`inicializarAplicacionError: ${error}`);
      }
    });
  }

}
