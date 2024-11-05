import { showAlert, showAlertError } from "../tools/message-functions";

export class Dinosaur {

  static jsonDinoExample =
    `{
      "name": "Tyrannosaurus Rex",
      "length": "12 mts",
      "height": "4 mts",
      "weight": "6 tons",
      "diet": "Carnivorous",
      "period": "Late Cretaceous",
      "extinction": "65 million years",
      "found": "Canada and USA",
      "image": "/assets/images/rex.jpg"
    }`;
  
    static jsonDinoEmpty =
    `{
      "name": "",
      "length": "",
      "height": "",
      "weight": "",
      "diet": "",
      "period": "",
      "extinction": "",
      "found": "",
      "image": ""
    }`;

   name = '';
   length = '';
   height = '';
   weight = '';
   diet = '';
   period = '';
   extinction = '';
   found = '';
   image = '';

  constructor() { }

  public static getNewDinosaur(
    name: string,
    length: string,
    height: string,
    weight: string,
    diet: string,
    period: string,
    extinction: string,
    found: string,
    image: string
  ) {
    const dino = new Dinosaur();
    dino.name = name;
    dino.length = length;
    dino.height = height;
    dino.weight = weight;
    dino.diet = diet;
    dino.period = period;
    dino.extinction = extinction;
    dino.found = found;
    dino.image = image;
    return dino;
  }

  // Devolver verdadero si el texto del QR contiene todos los datos de
  // un dinosaurio, de lo contrario se ha escaneado un QR que a lo 
  // mejor es válido, pero es de otra cosa que no es un dinosaurio
  // de esta aplicación.

  static isValidDinosaurQrCode(qr: string) {
    
    if (qr === '') return false;

    try {
      const json = JSON.parse(qr);

      if ( json.name       !== undefined
        && json.length     !== undefined
        && json.height     !== undefined
        && json.weight     !== undefined
        && json.diet       !== undefined
        && json.period     !== undefined
        && json.extinction !== undefined
        && json.found      !== undefined
        && json.image      !== undefined)
      {
        return true;
      }
    } catch(error) { }

    showAlert('El código QR escaneado no corresponde a un dinosaurio');
    return false;
  }
  
}
