import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class StockService {
  private productosStock = new Map<number, number>(); // Mapa para manejar el stock por producto ID
  private stockSubject = new BehaviorSubject<Map<number, number>>(new Map());

  stock$ = this.stockSubject.asObservable(); // Exponemos el observable

  constructor() {
    const stockGuardado = JSON.parse(localStorage.getItem('stock') || '[]');
    if (Array.isArray(stockGuardado)) {
      this.productosStock = new Map(stockGuardado);
    }
    this.stockSubject.next(this.productosStock);
  }

  inicializarStock(productos: any[]) {
    productos.forEach(producto => {
      this.productosStock.set(producto.id, producto.stock);
    });
    this.actualizarStock();
  }

  ajustarStock(productId: number, cantidad: number) {
    if (this.productosStock.has(productId)) {
      const stockActual = this.productosStock.get(productId);
      const nuevoStock = stockActual! - cantidad;
  
      // Asegúrate de que el stock no sea negativo
      if (nuevoStock >= 0) {
        this.productosStock.set(productId, nuevoStock);
        this.actualizarStock(); // Esto asegura que se emitan los cambios
      } else {
        console.log('Stock insuficiente para el producto con ID:', productId);
      }
    }
  }

  devolverStock(productId: number, cantidad: number) {
    if (this.productosStock.has(productId)) {
      const stockActual = this.productosStock.get(productId);
      this.productosStock.set(productId, stockActual! + cantidad);
      this.actualizarStock();
    }
  }

  obtenerStock(productId: number): number | undefined {
    return this.productosStock.get(productId);
  }

  private actualizarStock() {
    // Emitimos el nuevo estado del stock
    this.stockSubject.next(new Map(this.productosStock));
    const stockArray = Array.from(this.productosStock.entries());
    localStorage.setItem('stock', JSON.stringify(stockArray));
  }
}
