import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { calendar } from 'ionicons/icons';

registerLocaleData(localeEs); // Registrar el idioma español

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
  ],
})
export class DatePickerComponent implements ControlValueAccessor {
  @Input() label: string = 'Selecciona una fecha'; // Etiqueta del ion-input
  @Input() labelPlacement: 'floating' | 'fixed' | 'stacked' | 'floating' = 'floating'; // Posición de la etiqueta
  @Input() iconSlot: 'start' | 'end' = 'end'; // Posición del ícono de calendario
  @Input() addIcon: string = 'calendar'; // Nombre del ícono que se mostrará

  selectedDate: Date;        // Fecha seleccionada en formato Date
  selectedDateISO: string;   // Fecha en formato ISO para ion-datetime
  selectedDateText: string;  // Texto ingresado manualmente en la caja de texto
  showCalendar: boolean = false;  // Controla la visibilidad del ion-datetime

  // Callbacks para ControlValueAccessor (inicializados por defecto)
  private onChange: (date: Date) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    this.selectedDate = new Date();  // Fecha por defecto (hoy)
    this.selectedDateISO = this.selectedDate.toISOString();  // ISO para ion-datetime
    this.selectedDateText = this.formatDate(this.selectedDate);  // Inicializar caja de texto
    addIcons({ calendar });
  }

  // Método que se llama cuando el usuario cambia la fecha en el ion-datetime
  onDateChange(event: any) {
    this.showCalendar = false;
    this.selectedDate = new Date(event.detail.value);  // Convertir de ISO a Date
    this.selectedDateText = this.formatDate(this.selectedDate);  // Actualizar la caja de texto
    this.onChange(this.selectedDate);  // Notificar el cambio de valor
  }

  // Método para cambiar el texto manualmente en la caja de texto
  onDateTextChange() {
    const parsedDate = this.parseDate(this.selectedDateText);
    if (parsedDate) {
      this.selectedDate = parsedDate;
      this.selectedDateISO = parsedDate.toISOString();  // Actualizar ion-datetime
      this.onChange(this.selectedDate);  // Notificar el cambio de valor
    }
  }

  // Alternar la visibilidad del calendario
  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
  }

  // Formatear la fecha (DD/MM/YYYY)
  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Parsear el texto de la caja de texto a una fecha válida
  parseDate(dateString: string): Date | null {
    const [day, month, year] = dateString.split('/').map(Number);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      return new Date(year, month - 1, day);
    }
    return null;
  }

  // Implementación de ControlValueAccessor
  writeValue(date: Date): void {
    if (date) {
      this.selectedDate = date;
      this.selectedDateISO = date.toISOString();
      this.selectedDateText = this.formatDate(date);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Puedes implementar esto si quieres que el componente maneje el estado deshabilitado
  }
}
