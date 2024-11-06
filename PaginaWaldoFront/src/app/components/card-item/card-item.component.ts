import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { StockService } from '../../services/stock/stock.service';
import { CarritoItemDto } from '../../models/carritoItemDto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartShoppingService } from '../../services/cart-shopping/cart-shopping.service';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-card-item',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './card-item.component.html',
  styleUrl: './card-item.component.scss'
})
export class CardItemComponent implements OnInit {
  iconWsp: string = "/assets/img/icons8-whatsapp-48.png";
  iconCart: string = "/assets/img/add_shopping_cart_16dp_5F6368_FILL0_wght400_GRAD0_opsz20.png";
  @Input() product!: any;
  @Input() imgSrcCart!: string;
  @Input() isHome: boolean = false;
  @Input() isOnlyProduct: boolean = false;
  cantidadProductoSeleccionado: number = 0
  constructor(
    private stockService: StockService,
    private shoppingCartService : CartShoppingService
  ) {}

  ngOnInit(): void {
    // Suscripción al observable de stock solo si es necesario
    this.stockService.stock$.subscribe((stockMap) => {
      const nuevoStock = stockMap.get(this.product.id);
      if (nuevoStock !== undefined) {
        this.product.stock = nuevoStock; // Actualizar el stock en tiempo real
      }
    });
    
  }

  addCarritoNew(product: Product) {
    if (this.cantidadProductoSeleccionado > 0 && product.stock > 0) {
      if (this.cantidadProductoSeleccionado > product.stock) {
        Swal.fire("La cantidad seleccionada no puede ser mayor al stock del producto.")
      }else {
        const sessionId = localStorage.getItem('sessionId');
        var carrito: CarritoItemDto = {
          Cantidad: this.cantidadProductoSeleccionado,
          CarritoId: 0,
          PrecioUnitario: this.product.precio,
          ProductoId: this.product.id,
          UserId: sessionId
        };
    
        // Llamada al servicio del carrito
        this.shoppingCartService.agregarProducto(carrito).subscribe({
          next: (response : any) => {
            console.log("response")
            console.log(response)
            Swal.fire({
              title: "Producto agregado al carrito",
              text : response.producto.stock,
              icon: "success"
            });
            // Ajustar el stock después de agregar al carrito
            this.stockService.ajustarStock(product.id, this.cantidadProductoSeleccionado);
    
            // Reiniciar la cantidad seleccionada después de agregar al carrito
            this.cantidadProductoSeleccionado = 0;
          },
          error: (err) => {
            
            Swal.fire({
              title: "Error al agregar producto al carrito",
              text: "A ocurrido un error, porfavor recarge la pagina e intente denuevo.",
              icon: "warning"
            });
          }
        });
      }
      
    }
  }
  addQuantity(product: Product) {
    if (product.stock > 0) {
      this.cantidadProductoSeleccionado += 1;
      this.stockService.ajustarStock(product.id, 1); // Reducir el stock en tiempo real
    } else {
      console.log('No hay suficiente stock disponible.');
    }
  }
  removeQuantity(product: Product) {
    if (this.cantidadProductoSeleccionado > 0) {
      this.cantidadProductoSeleccionado -= 1;
      this.stockService.devolverStock(product.id, 1); // Devolver stock al reducir la cantidad seleccionada
    }
  }

  
}
