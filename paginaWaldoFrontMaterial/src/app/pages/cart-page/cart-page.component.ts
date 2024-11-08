import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhatsappButtonComponent } from '../../components/whatsapp-button/whatsapp-button.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CartShoppingService } from '../../services/cart-shopping/cart-shopping.service';
import { StockService } from '../../services/stock/stock.service';
import { CartItem } from '../../models/cart-item/cart-item';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule,
    WhatsappButtonComponent,
    RouterModule,
  MatButtonModule,
  MatCardModule],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss'
})
export class CartPageComponent  implements OnInit{
  carritoItems: any[] = [];
  sessionId: string;

  constructor(private shoppingCartService: CartShoppingService, private stockService: StockService) {
    this.sessionId = localStorage.getItem('sessionId') || this.generateSessionId();
  }

  ngOnInit() {
    this.shoppingCartService.carrito$.subscribe(items => {
      this.carritoItems = items;
      console.log(this.carritoItems)
      
    });

    this.shoppingCartService.obtenerCarrito(this.sessionId);
  }

  generateSessionId() {
    const sessionId = 'xxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    localStorage.setItem('sessionId', sessionId);
    return sessionId;
  }

  sendWhatsAppMessage() {
    const message = this.createWhatsAppMessage(this.carritoItems);
    const phoneNumber = '+56950074572'; // Número de WhatsApp del vendedor
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  createWhatsAppMessage(cartItems: CartItem[]): string {
    let message = 'Hola, me gustaría comprar los siguientes productos:\n\n';
    cartItems.forEach(item => {
      message += `- ${item.producto.nombre} x${item.cantidad} - ${item.producto.precio} cada uno.\n`;
    });
    message += `\nTotal: ${this.getTotal()}`;
    return message;
  }

  getTotal() {
    return this.carritoItems.reduce((acc, item) => acc + (item.cantidad * item.precioUnitario), 0);
  }

  removeProduct(productId: number, cantidad: number) {
    this.shoppingCartService.eliminarProducto(productId, this.sessionId, cantidad);
    this.stockService.devolverStock(productId, cantidad);
  }

  clearCart() {
    this.carritoItems.forEach(item => this.removeProduct(item.producto.id, item.cantidad));
  }

  createImageFromByteArray(base64String: string): string {
    return `data:image/jpeg;base64,${base64String}`;
  }

}
