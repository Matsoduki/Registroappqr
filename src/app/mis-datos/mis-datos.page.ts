import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { NivelEducacional } from '../models/nivel-educacional.model';
import { UsuarioService } from '../services/usuario.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.page.html',
  styleUrls: ['./mis-datos.page.scss'],
})
export class MisDatosPage {
  usuario: Usuario;
  repetirPassword: string = '';
  mensajeExito: string | null = null;
  mensajeError: string | null = null;
  fechaNacimientoTexto: string = '';

  nivelesEducacionales: NivelEducacional[] = [
    new NivelEducacional(1, 'Educación Básica'),
    new NivelEducacional(2, 'Educación Media'),
    new NivelEducacional(3, 'Educación Superior'),
    new NivelEducacional(4, 'Postgrado')
  ];

  constructor(private router: Router, private usuarioService: UsuarioService, private alertController: AlertController) {
    const navigation = this.router.getCurrentNavigation();
    this.usuario = navigation?.extras.state ? navigation.extras.state['usuario'] : null;
  
    if (!this.usuario) {
      console.error('No se recibieron datos del usuario');
      this.router.navigate(['/inicio']);
    }
  
    // Asegúrate de que el nivel educacional sea un objeto válido
    if (this.usuario.nivel) {
      this.usuario.nivel = this.nivelesEducacionales.find(nivel => nivel.id === this.usuario.nivel.id) || this.nivelesEducacionales[0];
    } else {
      this.usuario.nivel = this.nivelesEducacionales[0]; // Asigna un valor por defecto si no hay
    }
  
    // Inicializar el texto de fecha de nacimiento
    if (this.usuario.fechaNacimiento) {
      this.fechaNacimientoTexto = this.usuario.fechaNacimiento.toISOString().split('T')[0];
    }
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

  actualizarDatos() {
    // Verificar que las contraseñas coincidan
    if (this.usuario.password !== this.repetirPassword) {
      this.mensajeError = 'Las contraseñas no coinciden.';
      this.mensajeExito = null;
      return;
    }
  
    // Actualiza el usuario en el servicio
    this.usuarioService.updateUsuario(this.usuario);
    
    this.mensajeExito = 'Datos actualizados correctamente!';
    this.mensajeError = null;
  }

  irAMisDatos() {
    if (this.router.url !== '/mis-datos') {
      this.router.navigate(['/mis-datos']);
    }
  }


  cerrarSesion() {
    this.router.navigate(['/ingreso'], {
      state: { usuario: this.usuario }
    });
  }
}