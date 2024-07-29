import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import ILocation from '../../models/location/location.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(private http: HttpClient) {}

  getLocationByCep(cep: string): Observable<ILocation> {
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    return this.http.get<ILocation>(url);
  }
}
