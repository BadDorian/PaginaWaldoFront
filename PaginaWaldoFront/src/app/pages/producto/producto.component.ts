import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { StockService } from '../../services/stock/stock.service';
import { ProductService } from '../../services/product/product.service';
import { ShoppingCartComponent } from '../../components/shopping-cart/shopping-cart.component';
import { CardItemComponent } from "../../components/card-item/card-item.component";
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [RouterModule, ShoppingCartComponent, CardItemComponent, CommonModule],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.scss'
})
export class ProductoComponent {
  product: any;
  categories!: any 
  constructor(private route: ActivatedRoute, private stockService: StockService, private productService: ProductService) { }

  ngOnInit(): void {

    
    const productId = this.route.snapshot.paramMap.get('id');
    this.productService.getCompleteCategoryByProductId(productId).subscribe(x => {
      this.categories = x

      if (this.categories !== undefined) {
        var producto : Product = { id : this.categories.subCategorias[0].productos[0].id, 
          descripcion:this.categories.subCategorias[0].productos[0].descripcion,
          nombre : this.categories.subCategorias[0].productos[0].nombre,
          precio : this.categories.subCategorias[0].productos[0].precio,
          stock : this.categories.subCategorias[0].productos[0].stock,
          subCategoriaId : this.categories.subCategorias[0].productos[0].subCategoriaId,
          imgProduct : this.createImageFromByteArray(this.categories.subCategorias[0].productos[0].imgProduct),
          codigo:this.categories.subCategorias[0].productos[0].codigo
        }
        this.product = producto
        const stock = this.stockService.obtenerStock(this.product.id);
        if (stock !== undefined) {
          this.product.stock = stock;
         
          this.stockService.stock$.subscribe(stockMap => {
            const stock = stockMap.get(this.product.id);
            if (stock !== undefined) {
              this.product.stock = stock;
            }
          });
        }
      }
    })
  
   
  }

  createImageFromByteArray(base64String: string): string {
    return `data:image/jpeg;base64,${base64String}`;
  }
}
