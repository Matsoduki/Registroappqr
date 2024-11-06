import { NivelEducacional } from './nivel-educacional';

export class Persona {

  nombre = '';
  apellido = '';
  nivelEducacional: NivelEducacional = NivelEducacional.buscarNivel(1)!;
  fechaDeNacimiento: Date = new Date();
  direccion = '';

  constructor() { }

}
