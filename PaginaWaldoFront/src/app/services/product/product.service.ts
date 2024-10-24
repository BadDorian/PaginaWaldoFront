import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../../models/product';
import { environment } from '../../../environments/environment';



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
    return this.http.post<any>(`${environment.apiUrl}api/Producto/createProducto`,  product)
  }

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}api/Producto/getAllProducto`)
  }

  getProductsAdmin(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}api/Producto/getAllProductoAdmin`)
  }
  getProductById(id : any): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}api/Producto/getProductoById/${id}`)
  }
  getProductBySubCategoryId(subCategoryId : any): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}api/Producto/getProductoBySubCategoryId/${subCategoryId}`)
  }
  getCompleteCategoryByProductId(productId : any): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}api/Producto/getCompleteCategoryByProductId/${productId}`)
  }

  getCompleteCategoryBySubCatId(subCategoryId : any): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}api/Producto/getCompleteCategoryBySubCatId/${subCategoryId}`)
  }
  getCompleteCategoryById(categoryId : any): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}api/Producto/getCompleteCategoryById/${categoryId}`)
  }

  update(product: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}api/Producto/updateProducto`,  product)
  }
  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}api/Producto/deleteProducto/${id}` )
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}api/Producto/getAllCategories`)
  }

  getSubCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}api/Producto/getAllSubCategories`)
  }
}
