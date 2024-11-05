import { AlertController, ToastController } from "@ionic/angular";
import { MessageEnum } from "./message-enum";

export let showLogs: boolean = true;

export const getAppName = (): string => {
  return 'Angry Dinosaurs';
}

export const log = (source: string, message: string, returnValue?: boolean): any => {
  if (showLogs) {
    const red = 'color: red;';
    const green = 'color: dark green;';
    const blue = 'color: blue;';
    const black = 'color: blue;';
    const yellow = 'background-color: yellow;';
    const cyan = 'background-color: cyan;';
    const magenta = 'background-color: magenta;';
    const chocolate = 'background-color: chocolate;';
    let color1 = 'color: gray';
    let color2 = 'color: gray';

    if (source === 'StartSQLiteService') { color1 = yellow;    color2 = black;}
    if (source === 'StorageService')     { color1 = red;       color2 = black;}
    if (source === 'isLogged')           { color1 = blue;      color2 = black;}
    if (source === 'isAuthenticated')    { color1 = green;     color2 = black;}
    if (source === 'LoginGuardService')  { color1 = cyan;      color2 = black;}
    if (source === 'HomePage')           { color1 = chocolate; color2 = black;}

    console.log(`%c${source}:%c ${message}`, color1, color2);
  }
  if (returnValue) return returnValue;
  return;
}

export const showToast = 
  async (message:string, duration?: number) => {
    const controler = new ToastController();
    const toast = await controler.create({ 
      message:message, 
      duration: duration?duration:2000 });
    await toast.present();
  }

export const showSysAlert = 
  async (header: string, message: string): Promise<void> => {
    return new Promise((resolve) => {
      let alert = new AlertController().create({
        header, 
        message, 
        cssClass: 'custom-alert', 
        buttons: [{ text: 'Aceptar', handler: () => resolve() }]
      }).then((value: HTMLIonAlertElement) => value.present());
    });
  }

export const showSysAlertYesNo = 
  async (header: string, message: string): Promise<MessageEnum> => {
    return new Promise((resolve) => {
      let alert = new AlertController().create({
        header, message, 
        buttons: [
          { text: 'Sí', handler: () => { resolve(MessageEnum.YES); } },
          { text: 'No', handler: () => { resolve(MessageEnum.NO) } },
          { text: 'Cancelar', handler: () => { resolve(MessageEnum.CANCEL) } },
        ]
      }).then((value: HTMLIonAlertElement) => value.present());
    });
  }

export const getSpecialMessage = 
  (message: string, callAdmin: boolean = false, tryAgain: boolean = false): string => {
    if (message.slice(-1) !== '.') message += '.';
    
    if (callAdmin && tryAgain) {
      message += ' Por favor, comuníquese con el Administrador del Sistema o intente nuevamente más tarde.';
    } else if (callAdmin && !tryAgain) {
      message += ' Por favor, comuníquese con el Administrador del Sistema.';
    } else if (!callAdmin && tryAgain) {
      message += ' Por favor, intente nuevamente más tarde.';
    }

    return message;
  };


export const showAlertYesNo = 
  async (message: string): Promise<MessageEnum> => {
    return new Promise((resolve) => {
      if (message.trim() === '') resolve(MessageEnum.CANCEL);
      let alert = new AlertController().create({
        header: getAppName(),
        message, 
        buttons: [
          { text: 'Sí', handler: () => { resolve(MessageEnum.YES); } },
          { text: 'No', handler: () => { resolve(MessageEnum.NO) } },
        ]
      }).then((value: HTMLIonAlertElement) => value.present());
    });
  }

export const showAlertError = 
  async (source: string, err: any, toast: boolean = false): Promise<string> => {
    let errorMessage: string;

    // Verifica si el error es una instancia de Error o un objeto con un mensaje
    if (err instanceof Error) {
      errorMessage = `Error en ${source}. ${err.message}. `;
    } else if (typeof err === 'string') {
      // Si es una cadena, usa el string directamente
      errorMessage = `Error en ${source}. ${err}. `;
    } else {
      // Si es otro tipo de objeto o indefinido
      errorMessage = `Error en ${source}. Ocurrió un error inesperado. `;
    }

    errorMessage += 'Por favor, comuníquese con el Administrador del Sistema '
        + 'o intente nuevamente más tarde.';

    if (showLogs) console.log('🐞' + errorMessage);

    // Crea y muestra la alerta
    if (toast) {
      const toastController = new ToastController();
      const toastInstance = await toastController.create({
        header: 'Error del Sistema',
        message: errorMessage,
        duration: 4000,
        buttons: [{ text: 'Aceptar' }]
      });
      await toastInstance.present();
    } else {
      const alertController = new AlertController();
      const alertInstance = await alertController.create({
        header: 'Error del Sistema',
        message: errorMessage,
        buttons: [{ text: 'Aceptar' }]
      });
      await alertInstance.present();
    }

    return errorMessage;
  };

export const showAlert = 
  async (message: string, callAdmin?: boolean, tryAgain?: boolean): Promise<void> => {
    return new Promise((resolve) => {
      let alert = new AlertController().create({
        header: getAppName(),
        message: getSpecialMessage(message, callAdmin, tryAgain),
        buttons: [{ text: 'Aceptar', handler: () => resolve() }]
      }).then((value: HTMLIonAlertElement) => value.present());
    });
  }

export const mostrarEjemplosDeMensajes = 
  async (): Promise<void> => {
    showToast('Este es un mensaje toast');
    await showAlert('Este es un mensaje de alerta');
    await showAlert('Alerta 1', true);
    await showAlert('Alerta 2', false, true);
    await showAlert('Alerta 3', true, true);
    let response = await showAlertYesNo('Esta es una prueba de la función "showAlertYesNo" ' +
        'que permite escoger entre las alternativas Sí y No');
    if (response == MessageEnum.YES) await showAlert('El usuario ha contestado Yes');
    if (response == MessageEnum.NO) await showAlert('El usuario ha contestado No');
    if (response == MessageEnum.CANCEL) await showAlert('El usuario ha contestado Cancel');
  }