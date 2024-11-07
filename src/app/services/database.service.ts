import { capSQLiteChanges, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Injectable } from '@angular/core';
import { SQLiteService } from './sqlite.service';
import { Usuario } from '../model/usuario';
import { BehaviorSubject } from 'rxjs';
import { NivelEducacional } from '../model/nivel-educacional';
import { showAlertError } from '../tools/message-functions';
import { convertDateToString, convertStringToDate } from '../tools/date-functions';
import { Asistencia } from '../model/asistencia';

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
    'assets/img/anaPhoto.png' 
  );

  testUser2 = Usuario.getNewUsuario(
    'avalenzuela', 
    'avalenzuela@duocuc.cl', 
    'qwer', 
    'Nombre de su mejor amigo',
    'juanito',
    'Alberto', 
    'Valenzuela Nuñez',
    NivelEducacional.buscarNivel(5)!,
    new Date(2000, 1, 10),
    'La Pintana',
    'assets/img/albertoPhoto.png' 
  );

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
    'assets/img/carlaPhoto.png' 
  );

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
    },
    {
      toVersion: 2,
      statements: [`
        CREATE TABLE IF NOT EXISTS ASISTENCIAS (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL,
          sede TEXT NOT NULL,
          idAsignatura TEXT NOT NULL,
          seccion TEXT NOT NULL,
          nombreAsignatura TEXT NOT NULL,
          nombreProfesor TEXT NOT NULL,
          dia TEXT NOT NULL,
          bloqueInicio TEXT NOT NULL,
          bloqueTermino TEXT NOT NULL,
          horaInicio TEXT NOT NULL,
          horaFin TEXT NOT NULL
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
      await this.sqliteService.createDataBase({
        database: this.dataBaseName,
        upgrade: this.userUpgrades
      });
      // Cambia la versión de 1 a 2
      this.db = await this.sqliteService.open(this.dataBaseName, false, 'no-encryption', 2, false);
      await this.createTestUsers();
      await this.createTestAsistencias(); // Asegúrate de llamar a este método aquí
      await this.readUsers();
    } catch (error) {
      showAlertError('DataBaseService.initializeDataBase', error);
    }
  }

  async createTestUsers() {
    try {
      const testUsers = [this.testUser1, this.testUser2, this.testUser3];
  
      for (const user of testUsers) {
        const existingUser = await this.readUser(user.username);
        if (!existingUser) {
          await this.saveUser(user);
        }
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
  
      if (rows && rows.length > 0) {
        return this.rowToUser(rows[0]);
      } else {
        // Si no hay coincidencia, devuelve undefined
        console.warn(`No se encontró un usuario con username: ${username}`);
        return undefined;
      }
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
      showAlertError('DataBaseService.findUserByUsername', error);
      return undefined;
    }
  }

  async findUserByCorreo(correo: string): Promise<Usuario | undefined> {
    try {
      const q = 'SELECT * FROM USUARIO WHERE correo=?;';
      const rows = (await this.db.query(q, [correo])).values;
      return rows? this.rowToUser(rows[0]) : undefined;
    } catch (error) {
      showAlertError('DataBaseService.findUserByCorreo', error);
      return undefined;
    }
  }

  private rowToUser(row: any): Usuario {
    try {
      const user = new Usuario();
      if (row) {
        user.username = row.username || '';
        user.correo = row.correo || '';
        user.password = row.password || '';
        user.foto = row.foto || ''; // Asegúrate de que se lee la foto
        user.fraseSecreta = row.fraseSecreta || '';
        user.respuestaSecreta = row.respuestaSecreta || '';
        user.nombre = row.nombre || '';
        user.apellido = row.apellido || '';
        user.nivelEducacional = NivelEducacional.buscarNivel(row.nivelEducacional) || new NivelEducacional();
        user.fechaDeNacimiento = convertStringToDate(row.fechaDeNacimiento || '');
        user.direccion = row.direccion || '';
      }
      return user;
    } catch (error) {
      showAlertError('DataBaseService.rowToUser', error);
      return new Usuario();
    }
  }

  async saveUserAsistencia(username: string, asistencia: Asistencia): Promise<void> {
    const sqlInsert = `
      INSERT INTO ASISTENCIAS (username, sede, idAsignatura, seccion, nombreAsignatura, nombreProfesor, dia, bloqueInicio, bloqueTermino, horaInicio, horaFin)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    await this.db.run(sqlInsert, [
      username,
      asistencia.sede,
      asistencia.idAsignatura,
      asistencia.seccion,
      asistencia.nombreAsignatura,
      asistencia.nombreProfesor,
      asistencia.dia,
      asistencia.bloqueInicio,
      asistencia.bloqueTermino,
      asistencia.horaInicio,
      asistencia.horaFin
    ]);
  }

  async getHistorialAsistencias(username: string): Promise<any[]> {
    const q = 'SELECT * FROM ASISTENCIAS WHERE username=? ORDER BY dia DESC, horaInicio ASC;';
    const rows = (await this.db.query(q, [username])).values;
    return rows || [];
  }

  async createTestAsistencias() {
    try {
      const testAsistencias = [
        {
          username: 'atorres',
          asistencia: Asistencia.getNewAsistencia(
            'Alonso Ovalle',
            'PGY4121',
            '001D',
            'Aplicaciones Móviles',
            'Cristián Gómez Vega',
            '2022-08-09',
            7,
            9,
            '13:00',
            '15:15'
          )
        },
        {
          username: 'avalenzuela',
          asistencia: Asistencia.getNewAsistencia(
            'Sede B',
            'ASIGNATURA_2',
            '002D',
            'Historia',
            'Prof. González',
            '2024-11-02',
            2,
            3,
            '10:00',
            '12:00'
          )
        },
        {
          username: 'cfuentes',
          asistencia: Asistencia.getNewAsistencia(
            'Sede C',
            'ASIGNATURA_3',
            '003D',
            'Ciencias',
            'Prof. López',
            '2024-11-03',
            3,
            4,
            '12:00',
            '14:00'
          )
        }
      ];
  
      for (const { username, asistencia } of testAsistencias) {
        await this.saveUserAsistencia(username, asistencia);
      }
    } catch (error) {
      showAlertError('DataBaseService.createTestAsistencias', error);
    }
  }

async clearHistorialAsistencias(): Promise<void> {
  try {
    const q = 'DELETE FROM ASISTENCIAS;';
    await this.db.run(q);
    console.log("Historial de asistencias limpiado.");
  } catch (error) {
    showAlertError('DatabaseService.clearHistorialAsistencias', error);
  }
}


}

