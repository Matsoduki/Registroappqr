import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { showAlertError, showToast } from 'src/app/tools/message-functions';
import { Usuario } from '../model/usuario';
import { Storage } from '@ionic/storage-angular';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  storageAuthUserKey = 'AUTHENTICATED_USER';
  authUser = new BehaviorSubject<Usuario | null>(null);
  isFirstLogin = new BehaviorSubject<boolean>(false);
  storageQrCodeKey = 'QR_CODE';
  qrCodeData = new BehaviorSubject<string | null>(null);

  constructor(private router: Router, private db: DatabaseService, private storage: Storage) { }

  async initializeAuthService() {
    try {
      await this.storage.create();
    } catch (error) {
      showAlertError('AuthService.initializeAuthService', error);
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      return Boolean(await this.readAuthUser());
    } catch (error) {
      showAlertError('AuthService.isAuthenticated', error);
      return false;
    }
  }

  async readAuthUser(): Promise<Usuario | null> {
    try {
      const user = (await this.storage.get(this.storageAuthUserKey)) as Usuario | null;
      this.authUser.next(user ?? null);
      return user;
    } catch (error) {
      showAlertError('AuthService.readAuthUser', error);
      return null;
    }
  }

  async saveAuthUser(user: Usuario): Promise<Usuario | null> {
    try {
      await this.storage.set(this.storageAuthUserKey, user);
      this.authUser.next(user);
      return user;
    } catch (error) {
      showAlertError('AuthService.saveAuthUser', error);
      return null;
    }
  }

  async deleteAuthUser(): Promise<boolean> {
    try {
      await this.storage.remove(this.storageAuthUserKey);
      this.authUser.next(null);
      return true;
    } catch (error) {
      showAlertError('AuthService.deleteAuthUser', error);
      return false;
    }
  }

  async login(username: string, password: string): Promise<boolean> {
    try {
      const authUser = await this.storage.get(this.storageAuthUserKey);

      if (authUser) {
        this.authUser.next(authUser);
        this.isFirstLogin.next(false);
        await this.router.navigate(['/inicio']);
        return true;
      } else {
        const user = await this.db.findUser(username, password);

        if (user) {
          showToast(`¡Bienvenid@ ${user.nombre} ${user.apellido}!`);
          await this.saveAuthUser(user);
          this.isFirstLogin.next(true);
          await this.router.navigate(['/inicio']);
          return true;
        } else {
          showToast('El correo o la password son incorrectos');
          await this.router.navigate(['/ingreso']);
          return false;
        }
      }
    } catch (error) {
      showAlertError('AuthService.login', error);
      return false;
    }
  }

  async logout(): Promise<boolean> {
    try {
      const user = await this.readAuthUser();

      if (user) {
        showToast(`¡Hasta pronto ${user.nombre} ${user.apellido}!`);
        await this.deleteAuthUser();
      }

      await this.router.navigate(['/ingreso']);
      return true;
    } catch (error) {
      showAlertError('AuthService.logout', error);
      return false;
    }
  }

  // async readQrFromStorage(): Promise<string | null> {
  //   try {
  //     const qrData = await this.storage.get(this.storageQrCodeKey) as string | null;
  //     this.qrCodeData.next(qrData);
  //     return qrData;
  //   } catch (error) {
  //     showAlertError('AuthService.readQrFromStorage', error);
  //     return null;
  //   }
  // }

  // async saveQrToStorage(qrData: string): Promise<string | null> {
  //   try {
  //     await this.storage.set(this.storageQrCodeKey, qrData);
  //     this.qrCodeData.next(qrData);
  //     return qrData;
  //   } catch (error) {
  //     showAlertError('AuthService.saveQrToStorage', error);
  //     return null;
  //   }
  // }

  // async deleteQrFromStorage(): Promise<boolean> {
  //   try {
  //     await this.storage.remove(this.storageQrCodeKey);
  //     this.qrCodeData.next(null);
  //     return true;
  //   } catch (error) {
  //     showAlertError('AuthService.deleteQrFromStorage', error);
  //     return false;
  //   }
  // }
}
