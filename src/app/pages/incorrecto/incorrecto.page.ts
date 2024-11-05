import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { LanguageComponent } from 'src/app/components/language/language.component';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-incorrecto',
  templateUrl: './incorrecto.page.html',
  styleUrls: ['./incorrecto.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    LanguageComponent
  ]
})
export class IncorrectoPage implements AfterViewInit {

  @ViewChild('ingresar', { read: ElementRef }) itemIngresar!: ElementRef;
  
  constructor(private router: Router, private animationCtrl: AnimationController) { }

  ngAfterViewInit() {
    this.animIngresarCont();
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