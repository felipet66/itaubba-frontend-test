import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';

import IBusiness from '../../models/business/business.model';
import enviroments from '../../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  private apiUrl = enviroments.apiUrl;
  private businesses: IBusiness[] = [];

  constructor(private http: HttpClient) {}

  getBusinesses(): Observable<IBusiness[]> {
    return this.http.get<IBusiness[]>(this.apiUrl);
  }

  deleteBusiness(): Observable<void> {
    return of(undefined);
  }

  getBusinessById(id: number): Observable<IBusiness | undefined> {
    return this.getBusinesses().pipe(
      map((businesses: IBusiness[]) => businesses.find((b: IBusiness) => b.id === id))
    );
  }
}
