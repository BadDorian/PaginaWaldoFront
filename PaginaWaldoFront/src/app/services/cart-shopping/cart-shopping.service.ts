import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CarritoItemDto } from '../../models/carritoItemDto';
import { StockService } from '../stock/stock.service';

@Injectable({
  providedIn: 'root'
})
export class CartShoppingService {

  private carrito = new BehaviorSubject<any[]>([]);
  carrito$ = this.carrito.asObservable();
  private apiUrl = 'https://localhost:7283/api/Carrito';


  constructor(private http: HttpClient, private stockService : StockService) {}

  obtenerCarrito(sessionId: string | null) {
    this.http.get<any[]>(`${this.apiUrl}/getCarrito?userId=${sessionId}`).subscribe(items => {
      this.carrito.next(items);
    });
  }

  agregarProducto(carrito: CarritoItemDto) {
    return this.http.post(`${this.apiUrl}/addToCarrito`, carrito)
    .pipe(
      tap(() => {
        // Refrescar el carrito después de agregar un producto
        this.obtenerCarrito(carrito.UserId);
  
        // Ajustar el stock en el frontend después de agregar al carrito
        this.stockService.ajustarStock(carrito.ProductoId, carrito.Cantidad);
      })
    );
  }

  eliminarProducto(productoId: number, sessionId: string, cantidad: number) {
    this.http.delete<{ message: string }>(`${this.apiUrl}/removeFromCarrito?userId=${sessionId}&productoId=${productoId}&cantidad=${cantidad}`)
      .subscribe({
        next: (response) => {
          console.log(response.message); // Verifica el mensaje en la consola
          this.obtenerCarrito(sessionId);  // Refresca el carrito después de eliminar
        },
        error: (err) => {
          console.error('Error al eliminar producto del carrito:', err);
        }
      });
  }
}
