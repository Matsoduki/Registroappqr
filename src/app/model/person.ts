import { EducationalLevel } from './educational-level';

export class Person {

  firstName = '';
  lastName = '';
  educationalLevel: EducationalLevel = EducationalLevel.findLevel(1)!;
  dateOfBirth: Date = new Date();
  address = '';

  constructor() { }

}
