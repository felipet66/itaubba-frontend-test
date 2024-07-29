import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

import { BusinessService } from '../../shared/services/business/business.service';
import { ShimmerComponent } from '../../shared/components/shimmer/shimmer.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import IBusiness from '../../shared/models/business/business.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    RouterModule,
    TranslateModule,
    ShimmerComponent,
    ErrorStateComponent
  ]
})
export class ListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'business', 'valuation', 'status', 'action'];
  dataSource = new MatTableDataSource<IBusiness>();
  sortDirection: 'asc' | 'desc' = 'asc';
  currentCurrency = 'BRL';
  isLoading = true;
  isError = false;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private businessService: BusinessService, private router: Router, private translate: TranslateService) {
    this.translate.onLangChange.subscribe((event) => {
      this.currentCurrency = event.lang === 'pt' ? 'BRL' : 'USD';
    });
  }

  ngOnInit() {
    this.businessService.getBusinesses().subscribe(
      data => {
        this.dataSource.data = data;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
        this.isError = true;
        console.error(error);
      }
    );

    this.dataSource.filterPredicate = (data: IBusiness, filter: string) =>
      data.name.toLowerCase().includes(filter);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleSort() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.dataSource.data = this.dataSource.data.sort((a, b) => {
      const isAsc = this.sortDirection === 'asc';
      return this.compare(a.name, b.name, isAsc);
    });
  }

  compare(a: string, b: string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  viewDetails(id: number) {
    const selectedBusiness = this.dataSource.data.find(b => b.id === id);
    if (selectedBusiness) {
      this.router.navigate(['/details', id], { state: { business: selectedBusiness } });
    }
  }

  deleteElement(element: IBusiness) {
    const translate = this.translate;
    Swal.fire({
      title: translate.instant('app.confirmDeleteTitle'),
      text: translate.instant('app.confirmDeleteText', { name: element.name }),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: translate.instant('app.confirmDeleteYes'),
      cancelButtonText: translate.instant('app.confirmDeleteNo')
    }).then((result) => {
      if (result.isConfirmed) {
        this.businessService.deleteBusiness(element.id).subscribe(() => {
          Swal.fire(
            translate.instant('app.deleteSuccessTitle'),
            translate.instant('app.deleteSuccessText', { name: element.name }),
            'success'
          );
          this.dataSource.data = this.dataSource.data.filter(e => e.id !== element.id);
        });
      }
    });
  }
}
