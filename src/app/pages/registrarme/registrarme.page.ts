import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { IonCard, IonCardHeader, IonCardContent, IonInput, IonItem, IonSelect, IonSelectOption, IonLabel, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, IonFooter } from '@ionic/angular/standalone';
import { showToast } from 'src/app/tools/message-functions';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/model/usuario';
import { NivelEducacional } from 'src/app/model/nivel-educacional';

@Component({
  selector: 'app-registrarme',
  templateUrl: './registrarme.page.html',
  styleUrls: ['./registrarme.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    HeaderComponent,
    TranslateModule,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonInput,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonLabel,
    IonButton,
    IonFooter
  ]
})
export class RegistrarmePage implements OnInit {

  usuario: Usuario = new Usuario();
  listaNivelesEducacionales: NivelEducacional[] = NivelEducacional.getNiveles();
  fechaNacimientoString: string = '';
  repetirPassword: string = '';
  
  constructor(
    private bd: DatabaseService,
    private auth: AuthService
  ) { }

  ngOnInit() {
  }


  async registrarUsuario() {
    // Validar que el nombre de usuario no esté vacío
    if (!this.usuario.username || this.usuario.username.trim() === '') {
      showToast('Debe ingresar un nombre de usuario válido.');
      return;
    }
  
    if (this.usuario.nombre.trim() === '' || this.usuario.apellido.trim() === '') {
      showToast('El nombre y el apellido no pueden estar vacíos.');
      return;
    }
  
    if (this.usuario.correo.trim() === '') {
      showToast('Debe ingresar un correo electrónico.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.usuario.correo)) {
      showToast( 'El correo ingresado no tiene un formato válido.');
      return;
    }

    if (this.usuario.fraseSecreta.trim() === '' || this.usuario.respuestaSecreta.trim() === '') {
      showToast('La frase secreta y la respuesta no pueden estar vacías.');
      return;
    }
  
    const fechaHoy = new Date();
    fechaHoy.setHours(0, 0, 0, 0);

    const [year, month, day] = this.fechaNacimientoString.split('-').map(Number);
    const fechaSeleccionada = new Date(year, month - 1, day);

    if (!this.fechaNacimientoString) {
      showToast('Debe ingresar una fecha de nacimiento.');
      return;
    }

    if (fechaSeleccionada.getTime() === fechaHoy.getTime()) {
      showToast('La fecha de nacimiento no puede ser mayor a la fecha actual.');
      return;
    }

    if (!this.usuario.direccion || this.usuario.direccion.trim() === '') {
      showToast('El usuario debe tener una dirección.');
      return;
    }

    if (this.usuario.password.trim() === '') {
      showToast('Debe ingresar la contraseña.');
      return;
    }
    if (this.usuario.password.length < 4) {
      showToast('La contraseña debe tener al menos 4 caracteres.');
      return;
    }
    if (this.usuario.password !== this.repetirPassword) {
      console.log(this.fechaNacimientoString);
      showToast('Las contraseñas no coinciden');
      return;
    }
  
    try {
      await this.bd.createUser(this.usuario);
      showToast('El usuario fue registrado correctamente.');
    } catch (error) {
      if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
        showToast('El nombre de usuario o el correo ya están en uso.');
      } else {
        showToast('Error al registrar los datos del usuario.');
      }
    }
  }
  

  public actualizarNivelEducacional(event: any) {
    const nivelId = event.detail.value;
    this.usuario.nivelEducacional = NivelEducacional.buscarNivel(nivelId)!; 
  }


  async test1 () {
   this.bd.resetDatabase();
  }
}
