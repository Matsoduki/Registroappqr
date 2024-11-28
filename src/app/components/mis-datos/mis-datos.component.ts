import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonCard, IonCardHeader, IonCardContent, IonInput, IonItem, IonSelect, IonSelectOption, IonLabel, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, IonFooter } from '@ionic/angular/standalone';
import { Usuario } from 'src/app/model/usuario';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { NivelEducacional } from 'src/app/model/nivel-educacional'; 
import { showToast } from 'src/app/tools/message-functions';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonFooter
  ]
})
export class MisDatosComponent implements OnInit {
  usuario: Usuario = new Usuario();
  listaNivelesEducacionales: NivelEducacional[] = NivelEducacional.getNiveles();
  fechaNacimientoString: string = '';
  repetirPassword: string = '';

  constructor(
    private bd: DatabaseService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  async loadUserData() {
    try {
      const usuarioAuth = await this.auth.readAuthUser();
      if (usuarioAuth) {
        this.usuario = usuarioAuth;
  
        // Convertir fechaDeNacimiento a string para el input
        if (this.usuario.fechaDeNacimiento) {
          this.fechaNacimientoString = this.formatDateToInput(this.usuario.fechaDeNacimiento);
        }

      } else {
        showToast('No se encontró información del usuario.');
      }
    } catch (error) {
      console.error('Error cargando datos del usuario:', error);
      showToast('Error al cargar los datos del usuario.');
    }
  }

  formatDateToInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  public onFechaNacimientoChange(event: any) {
    const inputDate = event.detail.value; // Obtiene la fecha del evento
    if (inputDate) {
      const parts = inputDate.split('-');
      this.usuario.fechaDeNacimiento = new Date(+parts[0], +parts[1] - 1, +parts[2]); // Convierte a Date
      this.fechaNacimientoString = inputDate; // Actualiza la variable string
    }
  }

  async guardarUsuario() {
    
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
      await this.bd.saveUser(this.usuario);
      this.auth.saveAuthUser(this.usuario);
      showToast('El usuario fue guardado correctamente.');
    } catch (error) {
      console.error('Error guardando el usuario:', error);
      showToast('Error al guardar los datos del usuario.');
    }
  }

  public actualizarNivelEducacional(event: any) {
    const nivelId = event.detail.value;
    this.usuario.nivelEducacional = NivelEducacional.buscarNivel(nivelId)!; 
  }
}