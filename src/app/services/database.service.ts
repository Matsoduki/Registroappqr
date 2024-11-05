import { capSQLiteChanges, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Injectable } from '@angular/core';
import { SQLiteService } from './sqlite.service';
import { Usuario } from '../model/usuario';
import { BehaviorSubject } from 'rxjs';
import { NivelEducacional } from '../model/nivel-educacional';
import { showAlertError } from '../tools/message-functions';
import { convertDateToString, convertStringToDate } from '../tools/date-functions';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  testUser1 = Usuario.getNewUsuario(
    'atorres', 
    'atorres@duocuc.cl', 
    '1234', 
    'Nombre de su mascota', 
    'gato',
    'Ana', 
    'Torres Leiva', 
    NivelEducacional.buscarNivel(6)!,
    new Date(2000, 0, 5),
    'La Florida',
    'default-image.jpg');

  testUser2 = Usuario.getNewUsuario(
    'avalenzuela', 
    'avalenzuela@duocuc.cl', 
    'qwer', 
    'Nombre de su mejor amigo',
    'juanito',
    'Alberto', 
    'Valenzuela Nuñze',
    NivelEducacional.buscarNivel(5)!,
    new Date(2000, 1, 10),
    'La Pintana',
    'default-image.jpg');

  testUser3 = Usuario.getNewUsuario(
    'cfuentes', 
    'cfuentes@duocuc.cl', 
    'asdf', 
    'Lugar de nacimiento de su madre',
    'Valparaíso',
    'Carla', 
    'Fuentes González', 
    NivelEducacional.buscarNivel(6)!,
    new Date(2000, 2, 20),
    'Providencia',
    'default-image.jpg');

  userUpgrades = [
    {
      toVersion: 1,
      statements: [`
      CREATE TABLE IF NOT EXISTS USUARIO (
        username          TEXT PRIMARY KEY NOT NULL,
        correo            TEXT NOT NULL,
        password          TEXT NOT NULL,
        fraseSecreta      TEXT NOT NULL,
        respuestaSecreta  TEXT NOT NULL,
        nombre            TEXT NOT NULL,
        apellido          TEXT NOT NULL,
        nivelEducacional  INTEGER NOT NULL,
        fechaDeNacimiento TEXT NOT NULL,
        direccion         TEXT NOT NULL,
        foto              TEXT NOT NULL
      );
      `]
    }
  ];

  sqlInsertUpdate = `
    INSERT OR REPLACE INTO USUARIO (
      username, 
      correo, 
      password, 
      fraseSecreta, 
      respuestaSecreta,
      nombre, 
      apellido,
      nivelEducacional, 
      fechaDeNacimiento,
      direccion,
      foto
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;

  dataBaseName = 'RegistroAppDataBase';
  db!: SQLiteDBConnection;
  userList: BehaviorSubject<Usuario[]> = new BehaviorSubject<Usuario[]>([]);

  constructor(private sqliteService: SQLiteService) { }

  async initializeDataBase() {
    try {
      await this.sqliteService.createDataBase({database: this.dataBaseName, upgrade: this.userUpgrades});
      this.db = await this.sqliteService.open(this.dataBaseName, false, 'no-encryption', 1, false);
      await this.createTestUsers();
      await this.readUsers();
    } catch (error) {
      showAlertError('DataBaseService.initializeDataBase', error);
    }
  }

  async createTestUsers() {
    try {
      // Verifica y guarda al usuario 'atorres' si no existe
      const user1 = await this.readUser(this.testUser1.username);
      if (!user1) {
        await this.saveUser(this.testUser1);
      }
  
      // Verifica y guarda al usuario 'jperez' si no existe
      const user2 = await this.readUser(this.testUser2.username);
      if (!user2) {
        await this.saveUser(this.testUser2);
      }
  
      // Verifica y guarda al usuario 'cmujica' si no existe
      const user3 = await this.readUser(this.testUser3.username);
      if (!user3) {
        await this.saveUser(this.testUser3);
      }
  
    } catch (error) {
      showAlertError('DataBaseService.createTestUsers', error);
    }
  }


  // Create y Update del CRUD. La creación y actualización de un usuario
  // se realizarán con el mismo método, ya que la instrucción "INSERT OR REPLACE"
  // revisa la clave primaria y si el registro es nuevo entonces lo inserta,
  // pero si el registro ya existe, entonces los actualiza. Se debe tener cuidado de
  // no permitir que el usuario cambie su correo, pues dado que es la clave primaria
  // no debe poder ser cambiada.
  
  async saveUser(user: Usuario): Promise<void> {
    try {
      this.sqlInsertUpdate = `
        INSERT OR REPLACE INTO USUARIO (
          username, 
          correo, 
          password, 
          fraseSecreta, 
          respuestaSecreta,
          nombre, 
          apellido,
          nivelEducacional, 
          fechaDeNacimiento,
          direccion,
          foto
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;
      await this.db.run(this.sqlInsertUpdate, [
          user.username, 
          user.correo, 
          user.password,
          user.fraseSecreta, 
          user.respuestaSecreta, 
          user.nombre, 
          user.apellido,
          user.nivelEducacional.id, 
          convertDateToString(user.fechaDeNacimiento), 
          user.direccion,
          user.foto
      ]);
      await this.readUsers();
    } catch (error) {
      showAlertError('DataBaseService.saveUser', error);
    }
  }

  // Cada vez que se ejecute leerUsuarios() la aplicación va a cargar los usuarios desde la base de datos,
  // y por medio de la instrucción "this.listaUsuarios.next(usuarios);" le va a notificar a todos los programas
  // que se subscribieron a la propiedad "listaUsuarios", que la tabla de usuarios se acaba de cargar. De esta
  // forma los programas subscritos a la variable listaUsuarios van a forzar la actualización de sus páginas HTML.
  // ReadAll del CRUD. Si existen registros entonces convierte los registros en una lista de usuarios
  // con la instrucción ".values as Usuario[];". Si la tabla no tiene registros devuelve null.

  async readUsers(): Promise<Usuario[]> {
    try {
      const q = 'SELECT * FROM USUARIO;';
      const rows = (await this.db.query(q)).values;
      let users: Usuario[] = [];
      if (rows) {
        users = rows.map((row: any) => this.rowToUser(row));
      }
      this.userList.next(users);
      return users;
    } catch (error) {
      showAlertError('DataBaseService.readUsers', error);
      return [];
    }
  }

  // Read del CRUD
  async readUser(username: string): Promise<Usuario | undefined> {
    try {
      const q = 'SELECT * FROM USUARIO WHERE username=?;';
      const rows = (await this.db.query(q, [username])).values;
      return rows?.length? this.rowToUser(rows[0]) : undefined;
    } catch (error) {
      showAlertError('DataBaseService.readUser', error);
      return undefined;
    }
  }

  // Delete del CRUD
  async deleteByUsername(username: string): Promise<boolean> {
    try {
      const q = 'DELETE FROM USUARIO WHERE username=?';
      const result: capSQLiteChanges = await this.db.run(q, [username]);
      const rowsAffected = result.changes?.changes ?? 0;
      await this.readUsers();
      return rowsAffected > 0;
    } catch (error) {
      showAlertError('DataBaseService.deleteByUsername', error);
      return false;
    }
  }

  // Validar usuario
  async findUser(username: string, password: string): Promise<Usuario | undefined> {
    try {
      const q = 'SELECT * FROM USUARIO WHERE username=? AND password=?;';
      const rows = (await this.db.query(q, [username, password])).values;
      return rows? this.rowToUser(rows[0]) : undefined;
    } catch (error) {
      showAlertError('DataBaseService.findUser', error);
      return undefined;
    }
  }

  async findUserByUsername(username: string): Promise<Usuario | undefined> {
    try {
      const q = 'SELECT * FROM USUARIO WHERE username=?;';
      const rows = (await this.db.query(q, [username])).values;
      return rows? this.rowToUser(rows[0]) : undefined;
    } catch (error) {
      showAlertError('DataBaseService.findUserByEmail', error);
      return undefined;
    }
  }

  async findUserByEmail(email: string): Promise<Usuario | undefined> {
    try {
      const q = 'SELECT * FROM USUARIO WHERE email=?;';
      const rows = (await this.db.query(q, [email])).values;
      return rows? this.rowToUser(rows[0]) : undefined;
    } catch (error) {
      showAlertError('DataBaseService.findUserByEmail', error);
      return undefined;
    }
  }

  private rowToUser(row: any): Usuario {
    try {
      const user = new Usuario();
      user.username = row.username;
      user.correo = row.email;
      user.password = row.password;
      user.fraseSecreta = row.secretQuestion;
      user.respuestaSecreta = row.secretAnswer;
      user.nombre = row.firstName;
      user.apellido = row.lastName;
      user.nivelEducacional = NivelEducacional.buscarNivel(row.educationalLevel) || new NivelEducacional();
      user.fechaDeNacimiento = convertStringToDate(row.fechaDeNacimiento);
      user.direccion = row.direccion;
      return user;
    } catch (error) {
      showAlertError('DataBaseService.rowToUser', error);
      return new Usuario();
    }
  }

}
