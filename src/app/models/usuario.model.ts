import { NivelEducacional } from './nivel-educacional.model';

export class Usuario {
  constructor(
    public username: string,
    public email: string,
    public password: string,
    public pregunta: string,
    public respuesta: string,
    public nombre: string,
    public apellido: string,
    public nivel: NivelEducacional,
    public fechaNacimiento: Date
  ) {}

  static getListaUsuarios(): Usuario[] {
    return [
      new Usuario('atorres', 'atorres@duocuc.cl', '1234', '¿Cuál es tu animal favorito?', 'gato', 'Ana', 'Torres', new NivelEducacional(6, 'Educación Superior'), new Date(2000, 0, 1)),
      // Agrega más usuarios según sea necesario
    ];
  }
}