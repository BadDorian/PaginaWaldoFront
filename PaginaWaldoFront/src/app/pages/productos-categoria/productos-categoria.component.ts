import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { CommonModule } from '@angular/common';
import { CardItemComponent } from '../../components/card-item/card-item.component';
import { FormsModule } from '@angular/forms';
import { SideFiltersComponent } from '../../components/side-filters/side-filters.component';

@Component({
  selector: 'app-productos-categoria',
  standalone: true,
  imports: [CommonModule, CardItemComponent, RouterModule, FormsModule,SideFiltersComponent],
  templateUrl: './productos-categoria.component.html',
  styleUrl: './productos-categoria.component.scss'
})
export class ProductosCategoriaComponent {
  categoriProducts!: any;
  allProductsCategory: any[] = [];
  categoryId: string | null = null;
  
  filteredProducts: any[] = []; // Lista de productos filtrados

  
  constructor(private route: ActivatedRoute, private productService: ProductService) { }

  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.categoryId = params.get('categoryId');
      if (this.categoryId) {
        this.productService.getCompleteCategoryById(this.categoryId).subscribe(response => {
          if (response) {
            this.categoriProducts = response;
            this.allProductsCategory = response.subCategorias.flatMap((subCat: any) => subCat.productos);
            this.allProductsCategory = [];
            response.subCategorias.forEach((element: any) => {
              element.productos.forEach((x: any) => {
                let product = {
                  codigo: x.codigo,
                  descripcion: x.descripcion,
                  id: x.id,
                  imgProduct: this.createImageFromByteArray(x.imgProduct),
                  nombre: x.nombre,
                  precio: x.precio,
                  stock: x.stock,
                  subCategoriaId: x.subCategoriaId
                };
                this.allProductsCategory.push(product);
              });
            });
            console.log("all products category")
            console.log(this.allProductsCategory)
            this.filteredProducts = [...this.allProductsCategory]; // Inicializar con todos los productos
            console.log("filteredProducts")
            console.log(this.filteredProducts)
          }
        });
      }
    });
  }

  // Método para actualizar los productos filtrados
  updateFilteredProducts(products: any[]): void {
    this.filteredProducts = products;
  }

  createImageFromByteArray(base64String: string): string {
    return `data:image/jpeg;base64,${base64String}`;
  }
}
