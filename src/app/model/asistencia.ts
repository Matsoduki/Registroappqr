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

  sede = '';
  idAsignatura = '';
  seccion = '';
  nombreAsignatura = '';
  nombreProfesor = '';
  dia = '';
  bloqueInicio = '';
  bloqueTermino = '';
  horaInicio = '';
  horaFin = '';

  constructor() {}

  public static getNewAsistencia(
    sede: string,
    idAsignatura: string,
    seccion: string,
    nombreAsignatura: string,
    nombreProfesor: string,
    dia: string,
    bloqueInicio: string,
    bloqueTermino: string,
    horaInicio: string,
    horaFin: string
  ) {
    const asis = new Asistencia();
    asis.sede = sede;
    asis.idAsignatura = idAsignatura;
    asis.seccion = seccion;
    asis.nombreAsignatura = nombreAsignatura;
    asis.nombreProfesor = nombreProfesor;
    asis.dia = dia;
    asis.bloqueInicio = bloqueInicio;
    asis.bloqueTermino = bloqueTermino;
    asis.horaInicio = horaInicio;
    asis.horaFin = horaFin;
  }

  // Valida si el QR contiene los datos necesarios para una asistencia
  static isValidAsistenciaQrCode(datosQR: string, showError: boolean = false) {
    if (datosQR !== '') {

      try {
        const json = JSON.parse(datosQR);

        if (json.sede !== undefined
          && json.idAsignatura !== undefined
          && json.seccion !== undefined
          && json.nombreAsignatura !== undefined
          && json.nombreProfesor !== undefined
          && json.dia !== undefined
          && json.bloqueInicio !== undefined
          && json.bloqueTermino !== undefined
          && json.horaInicio !== undefined
          && json.horaFin !== undefined
          ) {
          return true;
        }
      } catch (error: any) {}
    }
    if (showError) {
      showAlert('El código QR escaneado no corresponde a una asistencia válida');
    }
    return false;
  }
}