import { Component } from '@angular/core';
import { CarouselComponent } from "../../components/carousel/carousel.component";
import { CommonModule } from '@angular/common';
import { CartItem } from '../../models/cart-item/cart-item';
import { ProductService } from '../../services/product/product.service';
import { ProductItemComponent } from '../../components/product-item/product-item.component';
import {MatGridListModule} from '@angular/material/grid-list';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselComponent, 
    CommonModule, 
    ProductItemComponent,
    MatGridListModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  lastProducts: any[] = [];
  products: any[] = [];
  carrito: CartItem[] = [];
  groupedProducts: { [key: string]: any[] } = {};
  stocks = new Map<number, number>();
  subCategoriesProducts : any[] = [] 
  lastProductsByCategory: { [key: string]: any[] } = {};
  constructor(
    private productService: ProductService,
  ) {}

  ngOnInit(): void {
    this.productService.getSubCategories().subscribe(response => {
      this.subCategoriesProducts = response
      this.productService.getProducts().subscribe((data) => {
        if (data) {
          this.products = data.map((x) => ({
            codigo: x.codigo,
            descripcion: x.descripcion,
            id: x.id,
            imgProduct: this.createImageFromByteArray(x.imgProduct),
            nombre: x.nombre,
            precio: x.precio,
            stock: x.stock,
            subCategoriaId: x.subCategoriaId
          }));
  
          this.groupProductsByType();
          this.lastProducts = this.products.slice(-3); // Obtener los últimos 3 productos
        }
      });
    })
   

  }

  createImageFromByteArray(base64String: string): string {
    return `data:image/jpeg;base64,${base64String}`;
  }



  groupProductsByType() {
    this.products.forEach((product) => {
      const tipoDescripcion = this.subCategoriesProducts.find(x => x.id === product.subCategoriaId)?.descripcion;
  
      if (!this.groupedProducts[tipoDescripcion]) {
        this.groupedProducts[tipoDescripcion] = [];
      }
  
      this.groupedProducts[tipoDescripcion].push(product);
    });
  
    // Obtener los últimos 4 productos de cada categoría
    Object.keys(this.groupedProducts).forEach((category) => {
      const productsInCategory = this.groupedProducts[category];
      this.lastProductsByCategory[category] = productsInCategory.slice(-4); // Selecciona los últimos 4 productos
    });
  }

  getTypes(): string[] {
    return Object.keys(this.groupedProducts);
  }

  getLastProductsByCategory(category: string): any[] {
    return this.lastProductsByCategory[category] || [];
  }
}
