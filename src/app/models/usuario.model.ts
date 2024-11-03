import { NivelEducacional } from './nivel-educacional.model';

export class Usuario {
  constructor(
    public id: number | null,
    public username: string,
    public email: string,
    public password: string,
    public pregunta: string,
    public respuesta: string,
    public nombre: string,
    public apellido: string,
    public nivel: NivelEducacional,
    public fechaNacimiento: Date // Cambiado de Text a Date
  ) {}

  static getListaUsuarios(): Usuario[] {
    return [
      new Usuario(1, 'atorres', 'atorres@duocuc.cl', '1234', '¿Cuál es tu animal favorito?', 'gato', 'Ana', 'Torres', new NivelEducacional(3, 3, 'Educación Superior'), new Date(2000, 0, 1)),
      new Usuario(2, 'jperez', 'jperez@duocuc.cl', '5678', '¿Cuál es tu postre favorito?', 'panqueques', 'Juan', 'Pérez', new NivelEducacional(3, 3, 'Educación Superior'), new Date(2000, 1, 1)),
      new Usuario(3, 'cmujica', 'cmujica@duocuc.cl', '0987', '¿Cuál es tu vehículo favorito?', 'moto', 'Carla', 'Mujica', new NivelEducacional(4, 4, 'Postgrado'), new Date(2000, 2, 1))
    ];
  }
}