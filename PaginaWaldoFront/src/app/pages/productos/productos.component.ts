import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { CommonModule } from '@angular/common';
import { CardItemComponent } from '../../components/card-item/card-item.component';
import { SideFiltersComponent } from '../../components/side-filters/side-filters.component';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, RouterModule,CardItemComponent,SideFiltersComponent],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent {
  categoriProducts!: any;
  allProducts: any[] = [];
  titleSubCategory: string = "";
  categoryId: string | null = null;
  subCategoryId: string | null = null;
  filteredProducts: any[] = [];

  constructor(private route: ActivatedRoute, private productService: ProductService) { }

  ngOnInit(): void {
    // Escucha los cambios en los parámetros de la ruta
    this.route.paramMap.subscribe(params => {
      this.subCategoryId = params.get('subCategoryId');
      // Verifica si subCategoryId es distinto de "null"
      if (this.subCategoryId ) {
        // Llama al servicio para obtener datos por subcategoría
        this.productService.getCompleteCategoryBySubCatId(this.subCategoryId).subscribe(response => {
          if (response) {
            this.categoriProducts = response;
            this.allProducts = response.subCategorias.flatMap((subCat: any) => subCat.productos);
            this.titleSubCategory = this.categoriProducts.subCategorias[0]?.descripcion || '';
            this.allProducts = []
            this.allProducts = this.categoriProducts.subCategorias[0]?.productos.map((x: { codigo: any; descripcion: any; id: any; imgProduct: any; nombre: any; precio: any; stock: any; subCategoriaId: any; }) => ({
              codigo: x.codigo,
              descripcion: x.descripcion,
              id: x.id,
              imgProduct: this.createImageFromByteArray(x.imgProduct),
              nombre: x.nombre,
              precio: x.precio,
              stock: x.stock,
              subCategoriaId: x.subCategoriaId
            }));
            //this.allProducts = this.categoriProducts.subCategorias[0]?.productos || [];
            console.log("all products")
            console.log(this.allProducts)
            this.filteredProducts = [...this.allProducts];
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
