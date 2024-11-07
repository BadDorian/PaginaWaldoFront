import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
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
  selector: 'app-categorie-products',
  standalone: true,
  imports: [ProductItemComponent, 
    CommonModule, 
    MatIconModule, 
    MatButtonModule,
  SideFiltersComponent],
  templateUrl: './categorie-products.component.html',
  styleUrl: './categorie-products.component.scss'
})
export class CategorieProductsComponent implements OnInit {
  categoriProducts!: any;
  allProductsCategory: any[] = [];
  categoryId: string | null = null;
  
  filteredProducts: any[] = []; // Lista de productos filtrados

  breadcrumbs: Breadcrumb[] = [
    { label: 'Home', url: '/' }
  ];
  constructor(private route: ActivatedRoute, private productService: ProductService,private router: Router) { }
 
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
            
            this.filteredProducts = [...this.allProductsCategory]; // Inicializar con todos los productos
            let breadCrumbItem =  { label:  this.categoriProducts.descripcion, url: '' }
            this.breadcrumbs.push(breadCrumbItem)
          }
        });
      }
    });
  }

  navigateTo(crumb: Breadcrumb) {
    this.router.navigate([crumb.url]);
  }

  // Método para actualizar los productos filtrados
  updateFilteredProducts(products: any[]): void {
    this.filteredProducts = products;
  }

  createImageFromByteArray(base64String: string): string {
    return `data:image/jpeg;base64,${base64String}`;
  }
}
