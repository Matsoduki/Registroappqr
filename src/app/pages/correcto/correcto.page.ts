import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageComponent } from 'src/app/components/language/language.component';
import { Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';
import { Usuario } from 'src/app/model/usuario';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-correcto',
  templateUrl: './correcto.page.html',
  styleUrls: ['./correcto.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    LanguageComponent
  ]
})
export class CorrectoPage implements AfterViewInit {
  password: string = '';  // Aquí se mostrará la contraseña del usuario
  username: string = '';  // Variable para capturar el username que viene en el state
  errorMessage: string | null = null;

  @ViewChild('ingresar', { read: ElementRef }) itemIngresar!: ElementRef;

  constructor(
    private router: Router,
    private animationCtrl: AnimationController,
    private databaseService: DatabaseService

  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.username = navigation.extras.state['username'] || ''; // Capturamos el username en lugar de la contraseña
    }

    this.cargarDatosUsuario();
  }

  ngAfterViewInit() {
    this.animIngresarCont();
  }

  async cargarDatosUsuario() {
    try {
      const usuarioValido = await this.databaseService.findUserByUsername(this.username); // Buscamos el usuario en la base de datos

      if (usuarioValido) {
        this.password = usuarioValido.password; // Asignamos la contraseña del usuario encontrado
      } else {
        this.errorMessage = 'Usuario no encontrado.';
      }
    } catch (error) {
      this.errorMessage = 'Error al cargar datos del usuario.';
      console.error('Error cargando el usuario:', error);
    }
  }

  animIngresarCont() {
    this.animationCtrl
      .create()
      .addElement(this.itemIngresar.nativeElement)
      .iterations(Infinity)
      .duration(6000)
      .keyframes([
        { offset: 0, transform: 'scaleX(1)' },
        { offset: 0.5, transform: 'scaleX(1.05)' },
        { offset: 1, transform: 'scaleX(1)' }
      ])
      .easing('ease-in-out')
      .play();
  }

  ingreso() {
    this.router.navigate(['/ingreso']);
  }
}