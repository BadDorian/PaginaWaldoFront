import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../models/product/product';
import Swal from 'sweetalert2';
import {MatTableModule} from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { EditProductModalComponent } from '../../components/edit-product-modal/edit-product-modal.component';
import { CreateProductModalComponent } from '../../components/create-product-modal/create-product-modal.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [MatTableModule, FormsModule, CommonModule, MatButtonModule, MatIconModule,MatDialogModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  selectedFile: File | null = null;
  uploadedImage: string | ArrayBuffer | null = null;
  description: string = '';
  name: string = '';
  code: number = 0;
  price : number = 0;
  stock: number = 0;
  type : number = 0;
  logedUser: string = ""
  imgsrc = `/assets/img/user.png`
  isLoggedIn: boolean = false;
  selectedItem: any = {  };
  allProducts: any[] = [];
  dataSource : any[] = [];
  displayedColumns: string[] = ['name', 'code', 'description', 'price','img','actions'];
  constructor(private dialog: MatDialog, private router:Router,private userService: UserService, private authService : AuthService, private productService : ProductService) {
 
  }
  ngOnInit(): void {
    this.getProductos()
 
  }


  openAddProductModal(): void {
    const dialogRef = this.dialog.open(CreateProductModalComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Agregar lógica para añadir el producto
        this.getProductos()
        console.log('Producto agregado:', result);
      }
    });
  }
  
  getProductos(){
    this.productService.getProductsAdmin().subscribe((categories: any[]) => {
      this.allProducts = [];
      categories.forEach((category: any) => {
        category.subCategorias.forEach((subCategory: any) => {  // Agrega el tipo SubCategoria
          subCategory.productos.forEach((product: Product) => {  // Agrega el tipo Producto
            // Añade una propiedad para la descripción del tipo de producto
            product.imgProduct = this.createImageFromByteArray(product.imgProduct)
            product.subTipoProductoDescripcion = subCategory.descripcion;
            product.tipoProductoDescripcion = category.descripcion;
            this.allProducts.push(product);
          });
        });
      });
      this.dataSource = this.allProducts
      console.log(this.allProducts)
    });
    
  }
  logout(){
    this.userService.clearUser()
    this.authService.logout()
    this.logedUser = ''
  }

  convertFileToBase64String(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  }
 

  openEditModal(item: any) {
    
    this.selectedItem = { ...item }; // Clona el objeto para evitar cambios inmediatos en la tabla
   
    const dialogRef = this.dialog.open(EditProductModalComponent, {
      width: '400px',
      data: this.selectedItem, // Pasar datos al modal si es necesario
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Realiza acciones si el usuario guardó los cambios
        this.getProductos()
        console.log('Producto guardado:', this.selectedItem);
      }
    });
  }


  

  createImageFromByteArray(base64String: string): string {
    return `data:image/jpeg;base64,${base64String}`;
  }

  deleteProduct(id : number){
    this.productService.delete(id).subscribe(response => {
      Swal.fire("Producto eliminado con exito!")
      this.getProductos()
    })
  }
}
