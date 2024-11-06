import { showAlert } from "../tools/message-functions";

export class Asistencia {

  static jsonExample =
    `{
      "sede": "Alonso Ovalle",
      "idAsignatura": "PGY4121",
      "seccion": "001D",
      "nombreAsignatura": "Aplicaciones Móviles",
      "nombreProfesor": "Cristián Gómez Vega",
      "dia": "2022-08-09",
      "bloqueInicio": 7,
      "bloqueTermino": 9,
      "horaInicio": "13:00",
      "horaFin": "15:15"
    }`;

  static jsonEmpty =
    `{
      "sede": "",
      "idAsignatura": "",
      "seccion": "",
      "nombreAsignatura": "",
      "nombreProfesor": "",
      "dia": "",
      "bloqueInicio": 0,
      "bloqueTermino": 0,
      "horaInicio": "",
      "horaFin": ""
    }`;

  sede: string;
  idAsignatura: string;
  seccion: string;
  nombreAsignatura: string;
  nombreProfesor: string;
  dia: string;
  bloqueInicio: number;
  bloqueTermino: number;
  horaInicio: string;
  horaFin: string;

  constructor(
    sede: string = '',
    idAsignatura: string = '',
    seccion: string = '',
    nombreAsignatura: string = '',
    nombreProfesor: string = '',
    dia: string = '',
    bloqueInicio: number = 0,
    bloqueTermino: number = 0,
    horaInicio: string = '',
    horaFin: string = ''
  ) {
    this.sede = sede;
    this.idAsignatura = idAsignatura;
    this.seccion = seccion;
    this.nombreAsignatura = nombreAsignatura;
    this.nombreProfesor = nombreProfesor;
    this.dia = dia;
    this.bloqueInicio = bloqueInicio;
    this.bloqueTermino = bloqueTermino;
    this.horaInicio = horaInicio;
    this.horaFin = horaFin;
  }

  public static getNewAsistencia(
    sede: string,
    idAsignatura: string,
    seccion: string,
    nombreAsignatura: string,
    nombreProfesor: string,
    dia: string,
    bloqueInicio: number,
    bloqueTermino: number,
    horaInicio: string,
    horaFin: string
  ): Asistencia {
    return new Asistencia(sede, idAsignatura, seccion, nombreAsignatura, nombreProfesor, dia, bloqueInicio, bloqueTermino, horaInicio, horaFin);
  }

  // Valida si el QR contiene los datos necesarios para una asistencia
  static isValidAsistenciaQrCode(qr: string): boolean {
    if (qr === '') return false;

    try {
      const json = JSON.parse(qr);

      if (json.sede && json.idAsignatura && json.seccion && json.nombreAsignatura &&
          json.nombreProfesor && json.dia && json.bloqueInicio !== undefined &&
          json.bloqueTermino !== undefined && json.horaInicio && json.horaFin) {
        return true;
      }
    } catch (error) { }

    showAlert('El código QR escaneado no corresponde a una asistencia válida');
    return false;
  }
}