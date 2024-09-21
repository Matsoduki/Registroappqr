import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import jsQR from 'jsqr';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage {
  @ViewChild('video') private video!: ElementRef;
  @ViewChild('canvas') private canvas!: ElementRef;

  usuario: Usuario;
  escaneando = false;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.usuario = navigation?.extras.state ? navigation.extras.state['usuario'] : null;

    if (!this.usuario) {
      console.error('No se recibieron datos del usuario');
    }
  }

  irAMisDatos() {
    console.log('Navegando a Mis Datos con usuario:', this.usuario);
    this.router.navigate(['/mis-datos'], {
      state: { usuario: this.usuario }
    });
  }

  comenzarEscaneo() {
    this.escaneando = true;
    this.iniciarCamara();
  }

  async iniciarCamara() {
    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    this.video.nativeElement.srcObject = mediaStream;
    this.video.nativeElement.setAttribute('playsinline', 'true');
    this.video.nativeElement.play();
    requestAnimationFrame(this.verificarVideo.bind(this));
  }

  async verificarVideo() {
    if (this.video.nativeElement.readyState === this.video.nativeElement.HAVE_ENOUGH_DATA) {
      const w = this.video.nativeElement.videoWidth;
      const h = this.video.nativeElement.videoHeight;
      this.canvas.nativeElement.width = w;
      this.canvas.nativeElement.height = h;
      const context = this.canvas.nativeElement.getContext('2d');
      context.drawImage(this.video.nativeElement, 0, 0, w, h);
      const imgData = context.getImageData(0, 0, w, h);
      const qrCode = jsQR(imgData.data, w, h);

      if (qrCode) {
        this.escaneando = false;
        this.mostrarDatosQROrdenados(qrCode.data);
      } else {
        requestAnimationFrame(this.verificarVideo.bind(this));
      }
    } else {
      requestAnimationFrame(this.verificarVideo.bind(this));
    }
  }

  mostrarDatosQROrdenados(datosQR: string) {
    const asistencia = JSON.parse(datosQR);
    console.log('Datos de asistencia:', asistencia);
    // Aquí podrías navegar a la página de mi-clase, pasando los datos de asistencia.
    this.router.navigate(['/mi-clase'], {
      state: { asistencia }
    });
  }
}