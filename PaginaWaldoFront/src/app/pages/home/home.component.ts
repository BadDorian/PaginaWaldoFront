import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../models/cartitem';
import { ProductService } from '../../services/product/product.service';
import { CommonModule } from '@angular/common';
import { CardItemComponent } from '../../components/card-item/card-item.component';
import { ShoppingCartComponent } from '../../components/shopping-cart/shopping-cart.component';
import { FloatingButtonComponent } from '../../components/floating-button/floating-button.component';
import { CarouselComponent } from '../../components/carousel/carousel.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, 
    CardItemComponent,
    ShoppingCartComponent, 
    FloatingButtonComponent, 
    CarouselComponent,
    RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  iconWsp: string = "/assets/img/icons8-whatsapp-48.png";
  lastProducts: any[] = [];
  products: any[] = [];
  carrito: CartItem[] = [];
  groupedProducts: { [key: string]: any[] } = {};
  stocks = new Map<number, number>();
  subCategoriesProducts : any[] = [] 
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
      const tipoDescripcion = this.subCategoriesProducts.find(x => x.id == product.subCategoriaId).descripcion;

      if (!this.groupedProducts[tipoDescripcion]) {
        this.groupedProducts[tipoDescripcion] = [];
      }

      this.groupedProducts[tipoDescripcion].push(product);
    });
  }

  getTypes(): string[] {
    return Object.keys(this.groupedProducts);
  }
}
