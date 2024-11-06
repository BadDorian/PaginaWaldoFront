import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './side-filters.component.html',
  styleUrl: './side-filters.component.scss'
})
export class SideFiltersComponent implements OnInit {
  @Input() allProductsCategory: any[] = []; // Lista de productos de la categoría
  @Input() categoriProducts: any; // Datos de la categoría
  @Input() isCategory: boolean = false;
  @Output() filteredProductsChange = new EventEmitter<any[]>(); // Emitir productos filtrados

  minPrice: number = 0;
  maxPrice: number = 0;
  selectedSortOption: string = 'priceAsc'; // Opción seleccionada para ordenar
  
  filteredProducts: any[] = []; // Lista de productos filtrados
  
  ngOnInit(): void {
    // Inicializa filteredProducts con todos los productos al inicio
    this.filteredProducts = [...this.allProductsCategory];
  }
  // Filtrar por subcategoría
  filterByType() {
    this.filteredProducts = [...this.allProductsCategory];
    this.filteredProductsChange.emit(this.filteredProducts);
  }

  // Filtrar por precio
  filterByPrice(): void {
    const min = this.minPrice || 0;
    const max = this.maxPrice || Number.MAX_SAFE_INTEGER;

    this.filteredProducts = this.allProductsCategory.filter(product => product.precio >= min && product.precio <= max);
    this.filteredProductsChange.emit(this.filteredProducts);
  }

  // Ordenar los productos
  sortProducts(): void {
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
    this.filteredProductsChange.emit(this.filteredProducts);
  }

    // Mostrar todos los productos sin filtros
    showAllProducts(): void {
      this.filteredProducts = [...this.allProductsCategory]; // Restablece la lista de productos completa
      this.filteredProductsChange.emit(this.filteredProducts); // Emite el cambio para el componente padre
    }
}
