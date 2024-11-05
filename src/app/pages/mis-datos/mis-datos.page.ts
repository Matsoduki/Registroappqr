import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonSelect, IonSelectOption, IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonButton, IonItem } from '@ionic/angular/standalone';
import { User } from 'src/app/model/user';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { Post } from 'src/app/model/post';
import { APIClientService } from 'src/app/services/apiclient.service';
import { EducationalLevel } from 'src/app/model/educational-level';
import { showToast } from 'src/app/tools/message-functions';

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.page.html',
  styleUrls: ['./mis-datos.page.scss'],
  standalone: true,
  imports: [IonButton, IonInput, IonContent, IonHeader, IonTitle, IonToolbar
    , CommonModule, FormsModule, IonItem, IonSelect, IonSelectOption]
})
export class MisDatosPage implements OnInit {

  usuario: User = new User();
  usuarios: User[] = [];
  publicaciones: Post[] = [];
  listaNivelesEducacionales: EducationalLevel[] = EducationalLevel.getLevels();

  constructor(
    private bd: DatabaseService,
    private auth: AuthService,
    private api: APIClientService) 
  { 
    /*
    this.bd.userList.subscribe((usuarios) => {
      if (usuarios) {
        this.usuarios = usuarios;
      }
    });
    this.auth.readAuthUser().then((usuario) => {
      if (usuario) {
        alert('en constructor: '+this.usuario.educationalLevel.id);
        this.usuario = usuario;
        console.log(this.usuario);
      }
    });
    */
  }

  ngOnInit() {

  }

  guardarUsuario() {
    // if (this.usuario.firstName.trim() === '') {
    //   showToast('El usuario debe tener un nombre');
    // } else {
    //   console.log(this.usuario);
    //   alert('en pagina nombre: '+this.usuario.firstName);
    //   alert('en pagina nivelEducacional: '+this.usuario.educationalLevel.id);
    //   alert('en pagina fecha: '+this.usuario.dateOfBirth);
    //   this.bd.saveUser(this.usuario);
    //   this.auth.saveAuthUser(this.usuario);
    //   showToast('El usuario fue guardado correctamente');
    // }
  }

  public actualizarNivelEducacional(event: any) {
    // debugger
    // this.usuario.educationalLevel 
    //   = EducationalLevel.findLevel(event.detail.value)!;
  }

  onFechaNacimientoChange(event: any) {
    //this.usuario.dateOfBirth = new Date(event.detail.value); // Convertir de ISO a Date
  }

}
