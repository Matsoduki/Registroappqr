import { OnDestroy, Component, ElementRef, ViewChild, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/model/usuario';
import jsQR from 'jsqr';
import { AnimationController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Asistencia } from 'src/app/model/asistencia';

@Component({
  selector: 'app-codigoqr',
  templateUrl: './codigoqr.component.html',
  styleUrls: ['./codigoqr.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule
  ]
})
export class CodigoqrComponent implements OnDestroy {
  @ViewChild('video') private video!: ElementRef;
  @ViewChild('canvas') private canvas!: ElementRef;
  @Output() scanned: EventEmitter<Asistencia> = new EventEmitter<Asistencia>(); // Cambiado a Asistencia
  @Output() stopped: EventEmitter<void> = new EventEmitter<void>();

  usuario: Usuario;
  escaneando = false;
  mediaStream: MediaStream | null = null;

  username: string = '';
  nombre: string = '';
  apellido: string = '';
  errorMessage: string | null = null;
  user: Usuario = new Usuario();

  constructor(
    private router: Router,
    private animationController: AnimationController,
    private authService: AuthService,
    private databaseService: DatabaseService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.usuario = navigation?.extras.state ? navigation.extras.state['usuario'] : null;

    if (navigation && navigation.extras.state) {
      this.username = navigation.extras.state['username'] || '';
    }

    this.authService.authUser.subscribe((user) => {
      console.log(user);
      if (user) {
        this.user = user;
      }
    });
    // Cargar datos del usuario desde la base de datos
    this.cargarDatosUsuario();
  }

  comenzarEscaneo() {
    this.escaneando = true;
    this.iniciarCamara();
  }

  detenerEscaneo() {
    if (this.video && this.video.nativeElement && this.video.nativeElement.srcObject) {
      const stream = this.video.nativeElement.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      this.video.nativeElement.srcObject = null;
      this.escaneando = false;
    }
  }

  ngOnDestroy() {
    this.stopCamera();
    this.stopped.emit();
  }

  async iniciarCamara() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      this.video.nativeElement.srcObject = this.mediaStream;
      this.video.nativeElement.setAttribute('playsinline', 'true');
      this.video.nativeElement.play();
      requestAnimationFrame(this.verificarVideo.bind(this));
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
    }
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

  stopCamera() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
  }

  mostrarDatosQROrdenados(datosQR: string) {
    const asistencia: Asistencia = JSON.parse(datosQR); // Asegúrate de que esto coincida con la estructura de Asistencia
    console.log('Datos de asistencia:', asistencia);
  
    // Emitir el evento al componente padre (HomePage)
    this.scanned.emit(asistencia); // Emitir el objeto de asistencia
    this.detenerEscaneo(); // Detiene el escaneo
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