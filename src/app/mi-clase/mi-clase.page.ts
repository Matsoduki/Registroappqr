import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Asistencia } from '../interfaces/asistencia';
import { ToastController } from '@ionic/angular';
import { AnimationController } from '@ionic/angular';
import { Usuario } from '../models/usuario.model';

@Component({
  selector: 'app-mi-clase',
  templateUrl: './mi-clase.page.html',
  styleUrls: ['./mi-clase.page.scss'],
})
export class MiClasePage implements AfterViewInit {
  asistencia: Asistencia;
  usuario: Usuario;

  @ViewChild('titulo', { read: ElementRef }) itemTitulo!: ElementRef;

  constructor(
    private router: Router,
    private animationCtrl: AnimationController,
    private toastCtrl: ToastController
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.asistencia = navigation?.extras.state?.['asistencia'];
    this.usuario = navigation?.extras.state ? navigation.extras.state['usuario'] : null;

    if (!this.asistencia) {
      console.error('No se recibieron datos de asistencia');
    }
  }

  ngAfterViewInit() {
    this.animarTituloIzqDer();
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

  irAMisDatos() {
    console.log('Navegando a Mis Datos con usuario:', this.usuario);
    this.router.navigate(['/mis-datos'], {
      state: { usuario: this.usuario }
    });
  }

  cerrarSesion() {
    this.router.navigate(['/ingreso'], {
      state: { usuario: this.usuario }
    });
  }
}