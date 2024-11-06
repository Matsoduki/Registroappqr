export class NivelEducacional {

  id = 1;
  nombre = 'Básica Incompleta';

  constructor() { }

  setLevel(id: number, nombre: string): void {
    this.id = id;
    this.nombre = nombre;
  }

  static getNewNivelEducacional(id: number, nombre: string): NivelEducacional {
    const nivel = new NivelEducacional();
    nivel.setLevel(id, nombre);
    return nivel;
  }

  static getNiveles(): NivelEducacional[] {
    const niveles: NivelEducacional[] = [
      NivelEducacional.getNewNivelEducacional(1, 'Básica Incompleta'),
      NivelEducacional.getNewNivelEducacional(2, 'Básica Completa'),
      NivelEducacional.getNewNivelEducacional(3, 'Media Incompleta'),
      NivelEducacional.getNewNivelEducacional(4, 'Media Completa'),
      NivelEducacional.getNewNivelEducacional(5, 'Superior Incompleta'),
      NivelEducacional.getNewNivelEducacional(6, 'Superior Completa')
    ];
    return niveles;
  }
  
  getEducacion(): string {
    return this.id.toString() + ' - ' + this.nombre;
  }

  static buscarNivel(id: number): NivelEducacional | undefined {
    return NivelEducacional.getNiveles().find(nivel => nivel.id === id);
  }

}
