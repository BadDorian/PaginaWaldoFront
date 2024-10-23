import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../../models/product';



@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://localhost:7283/api/Producto';
  private dataSubject = new BehaviorSubject<any[]>([]);
  
  constructor(private http: HttpClient) {
    
  }

  

  // Observable que otros componentes pueden suscribirse
  data$: Observable<any[]> = this.dataSubject.asObservable();

  // Método para actualizar los datos
  updateData(newData: any[]): void {
    this.dataSubject.next(newData);
  }

  // Método para obtener los datos actuales (sin suscripción)
  getData(): any[] {
    return this.dataSubject.getValue();
  }

  create(product: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/createProducto`,  product)
  }

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllProducto`)
  }

  getProductsAdmin(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllProductoAdmin`)
  }
  getProductById(id : any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getProductoById/${id}`)
  }
  getProductBySubCategoryId(subCategoryId : any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getProductoBySubCategoryId/${subCategoryId}`)
  }
  getCompleteCategoryByProductId(productId : any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getCompleteCategoryByProductId/${productId}`)
  }

  getCompleteCategoryBySubCatId(subCategoryId : any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getCompleteCategoryBySubCatId/${subCategoryId}`)
  }
  getCompleteCategoryById(categoryId : any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getCompleteCategoryById/${categoryId}`)
  }

  update(product: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/updateProducto`,  product)
  }
  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/deleteProducto/${id}` )
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllCategories`)
  }

  getSubCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllSubCategories`)
  }
}
