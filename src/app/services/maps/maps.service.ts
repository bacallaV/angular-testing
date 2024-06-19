import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  public center = {
    latitude: 0,
    longitude: 0,
  };

  constructor() { }

  public getCurrentPosition(): void {
    navigator.geolocation.getCurrentPosition((res) => {
      const { latitude, longitude } = res.coords;

      this.center = { latitude, longitude };
    });
  }
}
