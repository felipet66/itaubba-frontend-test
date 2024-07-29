import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';

import { BusinessService } from '../../shared/services/business/business.service';
import IBusiness from '../../shared/models/business/business.model';
import { LocationService } from '../../shared/services/location/location.service';
import ILocation from '../../shared/models/location/location.model';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ]
})
export class DetailsComponent implements OnInit {
  businessForm!: FormGroup;
  businessDetails!: IBusiness;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private businessService: BusinessService,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.businessForm = this.fb.group({
      cep: [''],
      street: [''],
      neighborhood: [''],
      city: [''],
      state: [''],
      name: [''],
      business: [''],
      valuation: [''],
      cnpj: [''],
      active: [false]
    });

    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.businessService.getBusinessById(id).subscribe((data: IBusiness | undefined) => {
      if (data) {
        this.businessDetails = data;
        this.initializeForm();
        if (data.cep) {
          this.locationService.getLocationByCep(data.cep).subscribe((location: ILocation) => {
            this.businessForm.patchValue({
              cep: data.cep,
              street: location.logradouro,
              neighborhood: location.bairro,
              city: location.localidade,
              state: location.uf
            });
          });
        }
      }
    });
  }

  initializeForm() {
    this.businessForm.patchValue({
      name: this.businessDetails.name,
      business: this.businessDetails.business,
      valuation: this.businessDetails.valuation,
      cnpj: this.businessDetails.cnpj,
      active: this.businessDetails.active
    });
  }

  onSubmit() {
    Swal.fire({
      title: 'Salvo!',
      text: 'Os dados foram salvos com sucesso.',
      icon: 'success',
      confirmButtonText: 'OK'
    }).then(() => {
      this.router.navigate(['/']);
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
