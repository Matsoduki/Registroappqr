import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import jsQR from 'jsqr';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements AfterViewInit {
  @ViewChild('titulo', { read: ElementRef }) itemTitulo!: ElementRef;
  @ViewChild('video') private video!: ElementRef;
  @ViewChild('canvas') private canvas!: ElementRef;

  usuario: Usuario;
  escaneando = false;

  constructor(
    private router: Router,
    private animationController: AnimationController
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.usuario = navigation?.extras.state ? navigation.extras.state['usuario'] : null;

    if (!this.usuario) {
      console.error('No se recibieron datos del usuario');
      this.cerrarSesion();
    }
  }

  ngAfterViewInit() {
    this.animarTituloIzqDer();
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

  detenerEscaneo() {
    if (this.video && this.video.nativeElement && this.video.nativeElement.srcObject) {
      // Acceder al stream del video
      const stream = this.video.nativeElement.srcObject as MediaStream;
  
      // Verifica si el stream tiene tracks (pistas de video/audio)
      if (stream) {
        const tracks = stream.getTracks(); // Obtiene todas las pistas de video/audio del stream
        tracks.forEach(track => track.stop()); // Detiene cada pista
  
        // Limpia el srcObject para detener la transmisión de video
        this.video.nativeElement.srcObject = null;
        this.escaneando = false; // Actualiza el estado del escaneo
      } else {
        console.error('No se encontró el stream en el elemento de video.');
      }
    } else {
      console.error('El elemento de video o su fuente no está disponible.');
    }
  }
  

  async iniciarCamara() {
    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    this.video.nativeElement.srcObject = mediaStream;
    this.video.nativeElement.setAttribute('playsinline', 'true');
    this.video.nativeElement.play();
    requestAnimationFrame(this.verificarVideo.bind(this));
  }

  async verificarVideo() {
    if (this.video && this.video.nativeElement) {
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
    } else {
      console.error('El video no está disponible.');
    }
  }

  mostrarDatosQROrdenados(datosQR: string) {
    const asistencia = JSON.parse(datosQR);
    console.log('Datos de asistencia:', asistencia);
    
    // Navegar a la página de mi-clase, pasando los datos de asistencia.
    this.router.navigate(['/mi-clase'], {
      state: { asistencia }
    });
  }

  animarTituloIzqDer() {
    this.animationController
      .create()
      .addElement(this.itemTitulo.nativeElement)
      .iterations(Infinity)
      .duration(12000)
      .fromTo('transform', 'translate(-75%)', 'translate(100%)')
      .fromTo('opacity', 1, 0.25)
      .play();
  }

  cerrarSesion() {
    this.router.navigate(['/ingreso'], {
      state: { usuario: this.usuario }
    });
  }
}