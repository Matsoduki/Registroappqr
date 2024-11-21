import { CommonModule } from '@angular/common';
import { Component, ElementRef, Output, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EventEmitter } from '@angular/core';
import jsQR, { QRCode } from 'jsqr';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/model/usuario';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-codigoqr',
  templateUrl: './codigoqr.component.html',
  styleUrls: ['./codigoqr.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule],
})
export class CodigoqrComponent implements OnInit, OnDestroy {

  @ViewChild('video', {static: false}) private video!: ElementRef;
  @ViewChild('canvas', {static: false}) private canvas!: ElementRef;
  @Output() scanned: EventEmitter<string> = new EventEmitter<string>();
  @Output() stopped: EventEmitter<void> = new EventEmitter<void>();

  qrData: string = '';
  mediaStream: MediaStream | null = null; // Almacena el flujo de medios
  scanning = true;

  usuario = new Usuario();
  private authUserSubs!: Subscription;

  constructor(private auth: AuthService) {
    this.startQrScanningForWeb()
  }

  ngOnInit() {
    this.authUserSubs = this.auth.authUser.subscribe(usuario => this.usuario = usuario ?? new Usuario());
  }
  
  async startQrScanningForWeb() {
    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });
    this.video.nativeElement.srcObject = this.mediaStream;
    this.video.nativeElement.setAttribute('playsinline', 'true');
    this.video.nativeElement.play();
    requestAnimationFrame(this.verifyVideo.bind(this));
  }
  

  async verifyVideo() {
    // Verifica que el elemento video esté definido y que el escaneo siga activo
    if (this.video?.nativeElement && this.scanning) {
      if (this.video.nativeElement.readyState === this.video.nativeElement.HAVE_ENOUGH_DATA) {
        if (this.getQrData()) return;
      }
      requestAnimationFrame(this.verifyVideo.bind(this));
    }
  }

  getQrData(): boolean {
    if (!this.video?.nativeElement || !this.canvas?.nativeElement) {
      // Si el elemento video o canvas no está definido, retorna false
      return false;
    }
  
    const w: number = this.video.nativeElement.videoWidth;
    const h: number = this.video.nativeElement.videoHeight;
    this.canvas.nativeElement.width = w;
    this.canvas.nativeElement.height = h;
    const context: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d', { willReadFrequently: true });
    
    context.drawImage(this.video.nativeElement, 0, 0, w, h);
    const img: ImageData = context.getImageData(0, 0, w, h);
    let qrCode: QRCode | null = jsQR(img.data, w, h, { inversionAttempts: 'dontInvert' });
    if (qrCode) {
      const data = qrCode.data;
      if (data !== '') {
        this.stopCamera();
        this.scanned.emit(qrCode.data);
        return true;
      }
    }
    return false;
  }

  stopQrScanning(): void {
    this.stopCamera();
    this.stopped.emit();

    this.scanning = false;
  }

  async resumeQrScanning() {
    location.reload();
  }

  ngOnDestroy() {
    this.stopCamera();
    if (this.authUserSubs) this.authUserSubs.unsubscribe();
  }

  stopCamera() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop()); // Detén todas las pistas de video
      this.mediaStream = null; // Limpia el flujo de medios
    }
  }
}
