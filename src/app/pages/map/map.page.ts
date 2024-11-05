import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { GeoService } from 'src/app/services/geo.service';
import * as L from 'leaflet'; // Importamos Leaflet
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    HeaderComponent,
    FooterComponent
  ]
})
export class MapPage implements OnInit {
  map: L.Map | null = null;
  addressName: string = '';
  distance: string = '';
  private currentPosition: { lat: number; lng: number } | null = null; // Almacena la posición actual
  private currentMarker: L.Marker | null = null; // Almacena el marcador actual
  private routeLine: L.Polyline | null = null; // Almacena la línea de ruta actual

  constructor(
    private geo: GeoService, 
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadMap();
    this.fixLeafletIconPath();
  }

  async loadMap() {
    try {
      const position = await this.geo.getCurrentPosition();
      if (position) {
        this.currentPosition = position; // Guardar la posición actual
        this.map = L.map('mapId').setView([position.lat, position.lng], 15); // Ajusta el zoom a 15

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        this.goToMyPosition(); // Ir a mi ubicación al cargar el mapa
      } else {
        console.log('Posición geográfica desconocida');
      }
    } catch (error) {
      console.log('Error al obtener la posición geográfica', error);
    }
  }

  goToDUOC() {
    const duocCoords = [-33.446968800767166, -70.65785871075605];
    this.goToPosition(duocCoords[0], duocCoords[1], 15, 'Instituto DUOC');
  }

  goToMyPosition() {
    if (this.currentPosition) {
      this.goToPosition(this.currentPosition.lat, this.currentPosition.lng, 15, 'Mi ubicación');
    }
  }

  goToPosition(lat: number, lng: number, zoom: number, popupText: string) {
    if (this.map) {
      this.map.setView([lat, lng], zoom);
      this.clearCurrentMarker(); // Limpiar marcador anterior
      this.currentMarker = L.marker([lat, lng]).addTo(this.map);
      this.currentMarker.bindPopup(popupText).openPopup();
    }
  }

  clearCurrentMarker() {
    if (this.currentMarker) {
      this.map?.removeLayer(this.currentMarker);
      this.currentMarker = null;
    }
  }

  showRouteToDuoc() {
    if (this.currentPosition) {
      this.goToPosition(this.currentPosition.lat, this.currentPosition.lng, 15, 'Mi ubicación');
      this.getRoute(this.currentPosition, { lat: -33.446968800767166, lng: -70.65785871075605 }, "walking");
    }
  }

  getRoute(start: { lat: number, lng: number }, end: { lat: number, lng: number }, mode: 'driving' | 'walking') {
    const url = `https://router.project-osrm.org/route/v1/${mode}/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;

    this.http.get(url).subscribe((response: any) => {
      if (this.map) {
        const routeCoords = response.routes[0].geometry.coordinates;
        const routeLatLngs = routeCoords.map((coord: [number, number]) => [coord[1], coord[0]]);
        
        this.clearCurrentRoute(); // Limpiar ruta anterior si es necesario

        this.routeLine = L.polyline(routeLatLngs, { color: 'blue', weight: 5 }).addTo(this.map);
        
        // Ajustar el mapa para mostrar la ruta
        this.map.fitBounds(this.routeLine.getBounds());

        const distance = response.routes[0].distance / 1000; // Distancia en kilómetros
        const duration = response.routes[0].duration / 60;   // Duración en minutos

        this.distance = `Distancia: ${distance.toFixed(2)} km, Estimado: ${duration.toFixed(2)} minutos`;
      }
    });
  }

  clearCurrentRoute() {
    if (this.routeLine) {
      this.map?.removeLayer(this.routeLine);
      this.routeLine = null;
    }
  }

  fixLeafletIconPath() {
    const iconDefault = L.icon({
      iconUrl: 'assets/leaflet/images/marker-icon.png',
      shadowUrl: 'assets/leaflet/images/marker-shadow.png',
    });
    L.Marker.prototype.options.icon = iconDefault;
  }
}