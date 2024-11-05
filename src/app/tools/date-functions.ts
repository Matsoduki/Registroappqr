import { showAlertError } from "./message-functions";

// Convierte una fecha tipo Date en un string con el formato dd/mm/yyyy

export const convertDateToString = (date: Date): string => {
  try {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // `getMonth()` es 0-indexed
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    showAlertError('date-functions.convertDateToString', error);
    return '';
  }
};

// Convierte una string de fecha con el formato dd/mm/yyyy en un Date

export const convertStringToDate = (dateString: string): Date => {
  try {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(dateString)) {
      showAlertError('date-functions.convertStringToDate', 
        'El formato de la fecha es incorrecto. Debe ser "dd/mm/yyyy"');
      return new Date();
    }
    const [day, month, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      console.error('Fecha inválida.');
      return new Date();
    }
    return date;
  } catch (error) {
    showAlertError('date-functions.convertStringToDate', error);
    return new Date();
  }
}


