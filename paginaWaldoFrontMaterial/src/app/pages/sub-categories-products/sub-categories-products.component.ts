import { Component } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductItemComponent } from '../../components/product-item/product-item.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SideFiltersComponent } from '../../components/side-filters/side-filters.component';

interface Breadcrumb {
  label: string;
  url: string;
}
@Component({
  selector: 'app-sub-categories-products',
  standalone: true,
  imports: [ProductItemComponent, 
    CommonModule, 
    MatIconModule, 
    MatButtonModule,
  SideFiltersComponent],
  templateUrl: './sub-categories-products.component.html',
  styleUrl: './sub-categories-products.component.scss'
})
export class SubCategoriesProductsComponent {
  categoriProducts!: any;
  allProducts: any[] = [];
  titleSubCategory: string = "";
  categoryId: string | null = null;
  subCategoryId: string | null = null;
  filteredProducts: any[] = [];
  breadcrumbs: Breadcrumb[] = [
    { label: 'Home', url: '/' }
  ];
  constructor(private route: ActivatedRoute, private productService: ProductService,private router: Router) { }

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
           
            this.filteredProducts = [...this.allProducts];

            let breadCrumbItemCategori =  { label:  this.categoriProducts.descripcion, url: '/category/' + this.categoriProducts.id }
            this.breadcrumbs.push(breadCrumbItemCategori)
            let breadCrumbItemSubCategori =  { label:  this.categoriProducts.subCategorias[0].descripcion, url: '/subCategory/' + this.categoriProducts.subCategorias[0].id }
            this.breadcrumbs.push(breadCrumbItemSubCategori)
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

  navigateTo(crumb: Breadcrumb) {
    this.router.navigate([crumb.url]);
  }
}
