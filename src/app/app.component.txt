import { Usuario } from 'src/app/model/usuario'; 
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DatabaseService } from './services/database.service';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000; // Aumentar a 60 segundos

describe('Probar el comienzo de la aplicación', () => {
  let mockDatabaseService: any; // Mock del servicio

  beforeEach(async () => {
    // Define el mock del servicio
    mockDatabaseService = {
      readUsers: jasmine.createSpy('readUsers').and.returnValue([]), // Retorna un array vacío como mock
      saveUser: jasmine.createSpy('saveUser').and.callFake((user) => console.log(`Usuario guardado: ${user}`)),
    };

    // Configuración de TestBed
    await TestBed.configureTestingModule({
      imports: [AppComponent], // AppComponent es standalone y va en imports
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Opcional, evita problemas con componentes personalizados
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: of({}) } } },
        { provide: DatabaseService, useValue: mockDatabaseService }, // Mock del servicio
      ],
    }).compileComponents();
  });

  it('Se debería crear la aplicación', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy(); // Verifica que la app se creó correctamente
  });

  it('Debería llamar a readUsers al iniciar', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    
    // Llamamos a detectChanges para simular el ciclo de vida del componente
    fixture.detectChanges(); 

    // Esperamos a que todas las promesas y observables se resuelvan
    await fixture.whenStable();

    // Verificamos que readUsers fue llamado
    expect(mockDatabaseService.readUsers).toHaveBeenCalled();
  });
});

describe('Probar clase de usuario', () => {
  // Pruebas para validar contraseñas
  describe('Probar que la contraseña sea correcta', () => {
    const usuario = Usuario.getNewUsuario(
      'agarcia', 
      'agarcia@duocuc.cl', 
      '1234', 
      '¿Cuál es tu animal favorito?', 
      'gato', 
      'Alison', 
      'Garcia', 
      NivelEducacional.buscarNivelEducacional(6)!,
      new Date(2000, 0, 1),
      'calle ejemplo 321'
    );

    it('Probar que la contraseña no sea vacía', () => {
      usuario.password = '';
      expect(usuario.validarPassword()).toContain('Para ingresar al sistema debe escribir la contraseña.');
    });

    it('Probar que la contraseña sea numérica y no "abcd"', () => {
      usuario.password = 'abcd';
      expect(usuario.validarPassword()).toContain('La contraseña debe ser numérica.');
    });

    it('Probar que la contraseña no supere los 4 dígitos como por ejemplo "1234567890"', () => {
      usuario.password = '1234567890';
      expect(usuario.validarPassword()).toContain('La contraseña debe ser numérica de 4 dígitos.');
    });

    it('Probar que la contraseña sea de 4 dígitos como por ejemplo "1234"', () => {
      usuario.password = '1234';
      expect(usuario.validarPassword()).toEqual('');
    });
  });

  // Pruebas para getFechaNacimiento
  describe('Probar el método getFechaNacimiento', () => {
    let usuario: Usuario;

    beforeEach(() => {
      usuario = new Usuario(); // Crear una nueva instancia de Usuario
    });

    it('debería devolver la fecha formateada correctamente si se asigna una fecha válida', () => {
      usuario.fechaNacimiento = new Date(1995, 10, 5); // 5 de noviembre de 1995
      const resultado = usuario.getFechaNacimiento();
      expect(resultado).toBe('05/11/1995');
    });

    it('debería devolver "No asignada" si la fecha de nacimiento no está asignada', () => {
      usuario.fechaNacimiento = undefined; // Sin asignar
      const resultado = usuario.getFechaNacimiento();
      expect(resultado).toBe('No asignada');
    });

    it('debería agregar ceros iniciales para días y meses de un solo dígito', () => {
      usuario.fechaNacimiento = new Date(2023, 2, 9); // 9 de marzo de 2023
      const resultado = usuario.getFechaNacimiento();
      expect(resultado).toBe('09/03/2023');
    });

    it('debería manejar correctamente fechas antiguas', () => {
      usuario.fechaNacimiento = new Date(1800, 0, 1); // 1 de enero de 1800
      const resultado = usuario.getFechaNacimiento();
      expect(resultado).toBe('01/01/1800');
    });

    it('debería devolver "No asignada" si la fecha de nacimiento es nula', () => {
      usuario.fechaNacimiento = null as any; // Nulo
      const resultado = usuario.getFechaNacimiento();
      expect(resultado).toBe('No asignada');
    });

    it('debería devolver "No asignada" si fechaNacimiento no es un objeto Date', () => {
      usuario.fechaNacimiento = '1995-11-05' as any; // Cadena no válida
      const resultado = usuario.getFechaNacimiento();
      expect(resultado).toBe('No asignada');
    });
  });
});
