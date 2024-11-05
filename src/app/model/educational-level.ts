export class EducationalLevel {

  id = 1;
  name = 'Básica Incompleta';

  constructor() { }

  setLevel(id: number, name: string): void {
    this.id = id;
    this.name = name;
  }

  static getNewEducationalLevel(id: number, name: string): EducationalLevel {
    const nivel = new EducationalLevel();
    nivel.setLevel(id, name);
    return nivel;
  }

  static getLevels(): EducationalLevel[] {
    const levels: EducationalLevel[] = [
      EducationalLevel.getNewEducationalLevel(1, 'Básica Incompleta'),
      EducationalLevel.getNewEducationalLevel(2, 'Básica Completa'),
      EducationalLevel.getNewEducationalLevel(3, 'Media Incompleta'),
      EducationalLevel.getNewEducationalLevel(4, 'Media Completa'),
      EducationalLevel.getNewEducationalLevel(5, 'Superior Incompleta'),
      EducationalLevel.getNewEducationalLevel(6, 'Superior Completa')
    ];
    return levels;
  }
  
  getEducation(): string {
    return this.id.toString() + ' - ' + this.name;
  }

  static findLevel(id: number): EducationalLevel | undefined {
    return EducationalLevel.getLevels().find(level => level.id === id);
  }

}
