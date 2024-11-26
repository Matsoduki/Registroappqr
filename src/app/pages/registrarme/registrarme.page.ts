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
  
    // Validar que el correo no esté vacío
    if (!this.usuario.correo || this.usuario.correo.trim() === '') {
      showToast('Debe ingresar un correo válido.');
      return;
    }
  
    // Validar que las contraseñas coincidan
    if (this.usuario.password !== this.repetirPassword) {
      showToast('Las contraseñas no coinciden.');
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
}
