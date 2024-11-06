import { OnDestroy, Component, ElementRef, ViewChild, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/model/usuario';
import jsQR, { QRCode } from 'jsqr';
import { AnimationController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageComponent } from 'src/app/components/language/language.component';
import { EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-codigoqr',
  templateUrl: './codigoqr.component.html',
  styleUrls: ['./codigoqr.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    LanguageComponent
  ]
})
export class CodigoqrComponent implements OnDestroy {
  @ViewChild('video') private video!: ElementRef;
  @ViewChild('canvas') private canvas!: ElementRef;
  @Output() scanned: EventEmitter<string> = new EventEmitter<string>();
  @Output() stopped: EventEmitter<void> = new EventEmitter<void>();

  usuario: Usuario;
  escaneando = false;
  mediaStream: MediaStream | null = null;

  username: string = '';
  nombre: string = '';
  apellido: string = '';
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private animationController: AnimationController,
    private authService: AuthService,
    private databaseService: DatabaseService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.usuario = navigation?.extras.state ? navigation.extras.state['usuario'] : null;

    if (navigation && navigation.extras.state) {
      this.username = navigation.extras.state['username'] || ''; // Acceso con corchetes
    }
    
    // Cargar datos del usuario desde la base de datos
    this.cargarDatosUsuario();
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
  
  ngOnDestroy() {
    this.stopCamera();
    this.stopped.emit();
  }

  async iniciarCamara() {
    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    this.video.nativeElement.srcObject = this.mediaStream;
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
          this.scanned.emit(qrCode.data);
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
  

  stopCamera() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop()); // Detén todas las pistas de video
      this.mediaStream = null; // Limpia el flujo de medios
    }
  }

  mostrarDatosQROrdenados(datosQR: string) {
    const asistencia = JSON.parse(datosQR);
    console.log('Datos de asistencia:', asistencia);

    // Navegar a la página de mi-clase, pasando los datos de asistencia.
    this.router.navigate(['/mi-clase'], {
      state: { asistencia, usuario: this.usuario }
    });
  }

  cerrarSesion() {
    this.authService.logout();
  }

  async cargarDatosUsuario() {
    try {
      const usuarioValido = await this.databaseService.findUserByUsername(this.username);

      if (usuarioValido) {
        this.nombre = usuarioValido.nombre;
        this.apellido = usuarioValido.apellido;
      } else {
        this.errorMessage = 'Usuario no encontrado.';
      }
    } catch (error) {
      this.errorMessage = 'Error al cargar los datos del usuario.';
      console.error(error);
    }
  }
}