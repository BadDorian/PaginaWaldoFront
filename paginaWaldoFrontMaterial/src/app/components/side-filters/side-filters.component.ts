import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
interface options {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-side-filters',
  standalone: true,
  imports: [CommonModule, 
    FormsModule, 
    RouterModule,
    MatButtonModule, 
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule],
  templateUrl: './side-filters.component.html',
  styleUrl: './side-filters.component.scss'
})
export class SideFiltersComponent implements OnChanges {
  @Input() allProductsCategory: any[] = [];
  @Input() categoriProducts: any;
  @Input() isCategory: boolean = false;
  @Output() filteredProductsChange = new EventEmitter<any[]>();

  minPrice: number = 0;
  maxPrice: number = 0;
  selectedSortOption: string = 'priceAsc';
  selectOptions: options[] = [
    {value: 'priceAsc', viewValue: 'Precio: Menor a Mayor'},
    {value: 'priceDesc', viewValue: 'Precio: Mayor a Menor'},
    {value: 'nameAsc', viewValue: 'Nombre: A - Z'},
    {value: 'nameDesc', viewValue: 'Nombre: Z - A'}
  ];

  filteredProducts: any[] = [];
  ngOnChanges(changes: SimpleChanges): void {
    // Detecta cambios en allProductsCategory y actualiza filteredProducts
    if (changes['allProductsCategory']) {
      this.filteredProducts = [...this.allProductsCategory];
      this.applyFilters(); // Aplica filtros si hay alguno seleccionado
    }
  }

  // Filtrar por tipo o categoría
  filterByType(): void {
    this.filteredProducts = [...this.allProductsCategory];
    this.applyFilters();
  }

  // Filtrar por precio
  filterByPrice(): void {
    this.applyFilters();
  }

  // Ordenar los productos
  sortProducts(): void {
    this.applyFilters();
  }

  // Actualizar los productos aplicando filtros y ordenamiento
  private applyFilters(): void {
    // Filtra por precio
    const min = this.minPrice || 0;
    const max = this.maxPrice || Number.MAX_SAFE_INTEGER;
    this.filteredProducts = this.allProductsCategory.filter(product => product.precio >= min && product.precio <= max);

    // Ordena según la opción seleccionada
    switch (this.selectedSortOption) {
      case 'priceAsc':
        this.filteredProducts.sort((a, b) => a.precio - b.precio);
        break;
      case 'priceDesc':
        this.filteredProducts.sort((a, b) => b.precio - a.precio);
        break;
      case 'nameAsc':
        this.filteredProducts.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'nameDesc':
        this.filteredProducts.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
    }

    // Emitir el cambio a filteredProducts
    this.filteredProductsChange.emit(this.filteredProducts);
  }

  // Restablecer y mostrar todos los productos
  showAllProducts(): void {
    this.filteredProducts = [...this.allProductsCategory];
    this.filteredProductsChange.emit(this.filteredProducts);
  }
}
