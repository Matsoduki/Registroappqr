import { Injectable, NgZone } from '@angular/core';
import { showAlertError, showAlertYesNo, showToast } from '../tools/message-functions';
import { BarcodeFormat, BarcodeScanner, ScanResult } from '@capacitor-mlkit/barcode-scanning';
import { MessageEnum } from '../tools/message-enum';

@Injectable({
  providedIn: 'root'
})
export class ScannerService {

  constructor(private readonly ngZone: NgZone) { }

  /**
   *  Proceso de escanéo de QR nativo en Android
   *  Ver: https://github.com/capawesome-team/capacitor-barcode-scanning
   */

  async scan(): Promise<string>
  {
    return await this.runGoogleBarcodeScanner();
  }

  private async runGoogleBarcodeScanner(): Promise<string> {
    try {
      await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable().then(
        async (result) => {
          if (!result.available) 
            await BarcodeScanner.installGoogleBarcodeScannerModule();
        });

      if (!await BarcodeScanner.isSupported()) {
        return Promise.resolve('ERROR: Google Barcode Scanner no es compatible con este celular');
      }

      let status = await BarcodeScanner.checkPermissions();

      if (status.camera === 'denied') {
        status = await BarcodeScanner.requestPermissions();
      }
      
      if (status.camera === 'denied') {
        const resp = await showAlertYesNo( 
            'No fue posible otorgar permisos a la cámara. ¿Quiere '
          + 'acceder a las opciones de configuración de la '
          + 'aplicación y darle permiso manualmente?');
        if (resp === MessageEnum.YES) await BarcodeScanner.openSettings();
        return Promise.resolve('');
      }

      await BarcodeScanner.removeAllListeners().then(() => {
        BarcodeScanner.addListener('googleBarcodeScannerModuleInstallProgress', (event) => {
          this.ngZone.run(() => {
            console.log('googleBarcodeScannerModuleInstallProgress', event);
          });
        });
      });

      const { barcodes }: ScanResult = await BarcodeScanner.scan(
        { formats: [BarcodeFormat.QrCode],}
      );
      return Promise.resolve(barcodes[0].displayValue);
      
    } catch(error: any) {

      // Si el scanner devuelve un string que contiene la palabra canceled
      // es porque el usuario canceló la captura del QR, por lo que
      // se debe devolver un sring vacío.
      if (error.message.includes('canceled')) {
        showToast('El escaneo de QR fue cancelado');
        return Promise.resolve('');
      }

      // Si el error es de otro tipo, hay que informarlo al usuario
      showAlertError('runGoogleBarcodeScanner', error);
      return Promise.resolve('ERROR');
    }
  }

}
