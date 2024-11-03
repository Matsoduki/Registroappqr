import { TestBed } from '@angular/core/testing';
import { UsuarioService } from './usuario.service';
import { SQLiteService } from '@ionic-native/sqlite-porter/ngx';
import { Platform } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let sqliteServiceSpy: jasmine.SpyObj<SQLiteService>;
  let platformSpy: jasmine.SpyObj<Platform>;

  beforeEach(() => {
    const sqliteSpy = jasmine.createSpyObj('SQLiteService', ['createConnection', 'importSqlToDb']);
    const platformSpyObj = jasmine.createSpyObj('Platform', ['ready']);
    
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UsuarioService,
        { provide: SQLiteService, useValue: sqliteSpy },
        { provide: Platform, useValue: platformSpyObj }
      ]
    });

    service = TestBed.inject(UsuarioService);
    sqliteServiceSpy = TestBed.inject(SQLiteService) as jasmine.SpyObj<SQLiteService>;
    platformSpy = TestBed.inject(Platform) as jasmine.SpyObj<Platform>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize the database and create tables', async () => {
    platformSpy.ready.and.returnValue(Promise.resolve());
    sqliteServiceSpy.createConnection.and.returnValue(Promise.resolve({ open: jasmine.createSpy() }));
    sqliteServiceSpy.importSqlToDb.and.returnValue(Promise.resolve());

    await service['initDatabase']();

    expect(platformSpy.ready).toHaveBeenCalled();
    expect(sqliteServiceSpy.createConnection).toHaveBeenCalledWith('usuarios.db');
    expect(sqliteServiceSpy.importSqlToDb).toHaveBeenCalled();
  });

  // Agrega más pruebas aquí para otros métodos de servicio
});