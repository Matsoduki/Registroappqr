import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { NivelEducacional } from '../models/nivel-educacional.model';
import { UsuarioService } from '../services/usuario.service';
import { AnimationController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.page.html',
  styleUrls: ['./mis-datos.page.scss'],
})
export class MisDatosPage implements AfterViewInit {
  usuario: Usuario;
  repetirPassword: string = '';
  fechaNacimientoTexto: string = '';
  
  nivelesEducacionales: NivelEducacional[] = [
    new NivelEducacional(1, 1, 'Educación Básica'),
    new NivelEducacional(2, 2, 'Educación Media'),
    new NivelEducacional(3, 3, 'Educación Superior'),
    new NivelEducacional(4, 4, 'Postgrado')
  ];

  @ViewChild('titulo', { read: ElementRef }) itemTitulo!: ElementRef;

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private alertController: AlertController,
    private animationCtrl: AnimationController
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.usuario = navigation?.extras.state ? navigation.extras.state['usuario'] : null;

    if (!this.usuario) {
      console.error('No se recibieron datos del usuario');
      this.router.navigate(['/inicio']);
    }

    if (this.usuario.nivel) {
      this.usuario.nivel = this.nivelesEducacionales.find(nivel => nivel.id === this.usuario.nivel.id) || this.nivelesEducacionales[0];
    } else {
      this.usuario.nivel = this.nivelesEducacionales[0]; // Valor por defecto
    }

    if (this.usuario.fechaNacimiento) {
      this.fechaNacimientoTexto = this.usuario.fechaNacimiento.toISOString().split('T')[0]; // Formato ISO
    }
  }

  ngAfterViewInit() {
    this.animarTituloIzqDer();
  }

  async abrirSelectorFecha() {
    const alert = await this.alertController.create({
      header: 'Selecciona la fecha de nacimiento',
      inputs: [
        {
          name: 'fechaNacimiento',
          type: 'date',
          value: this.fechaNacimientoTexto,
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Seleccionar',
          handler: (data) => {
            this.fechaNacimientoTexto = data.fechaNacimiento;
            this.usuario.fechaNacimiento = new Date(data.fechaNacimiento);
          },
        },
      ],
    });

    await alert.present();
  }

  async actualizarDatos() {
    if (this.usuario.password !== this.repetirPassword) {
      const mensajeError = 'Las contraseñas no coinciden.';
      await this.mostrarAlerta('Error', mensajeError);
      return;
    }

    if (!this.usuario.id) {
      await this.mostrarAlerta('Error', 'No se pudo encontrar el ID del usuario.');
      return;
    }

    try {
      await this.usuarioService.updateUsuario(this.usuario);
      const mensajeExito = 'Datos actualizados correctamente!';
      await this.mostrarAlerta('Éxito', mensajeExito);
    } catch (error) {
      const mensajeError = (error as Error).message || 'Error desconocido';
      await this.mostrarAlerta('Error', 'No se pudo actualizar el usuario: ' + mensajeError);
    }
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['Aceptar']
    });

    await alert.present();
  }

  irAMisDatos() {
    if (this.router.url !== '/mis-datos') {
      this.router.navigate(['/mis-datos']);
    }
  }

  animarTituloIzqDer() {
    this.animationCtrl
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