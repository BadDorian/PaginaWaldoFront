import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../models/product';
import Swal from 'sweetalert2';
import { TipoProducto } from '../../models/tipoProducto';
import { SubCategoria } from '../../models/subCategoria';

@Component({
  selector: 'app-administracion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './administracion.component.html',
  styleUrl: './administracion.component.scss'
})
export class AdministracionComponent {
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
  constructor( private router:Router,private userService: UserService, private authService : AuthService, private productService : ProductService) {
 
  }
  ngOnInit(): void {
    this.getProductos()
 
  }


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      
      const reader = new FileReader();
      reader.onload = () => {
        this.uploadedImage = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit() {
    if (this.selectedFile) {
      console.log(this.selectedFile)
      this.convertFileToBase64String(this.selectedFile).then(base64String => {
        // Aquí puedes enviar el byteArray al backend
        var producto : any = { id : 0, 
          description:this.description,
          name : this.name,
          price : parseInt(this.price.toString()),
          stock : parseInt(this.stock.toString()),
          type : parseInt(this.type.toString()),
          image : base64String,
          code:parseInt(this.code.toString())
        }

        this.productService.create(producto).subscribe(response => 
          {
            this.getProductos()
            
          })
      }).catch(error => {
        console.error('Error converting file:', error);
      });
    }
  }
  
  getProductos(){
    this.productService.getProductsAdmin().subscribe((categories: TipoProducto[]) => {
      this.allProducts = [];
      categories.forEach((category: TipoProducto) => {
        category.subCategorias.forEach((subCategory: SubCategoria) => {  // Agrega el tipo SubCategoria
          subCategory.productos.forEach((product: Product) => {  // Agrega el tipo Producto
            // Añade una propiedad para la descripción del tipo de producto
            product.imgProduct = this.createImageFromByteArray(product.imgProduct)
            product.subTipoProductoDescripcion = subCategory.descripcion;
            product.tipoProductoDescripcion = category.descripcion;
            this.allProducts.push(product);
          });
        });
      });
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
  convertFileToBase64StringUpdate(file: File): Promise<string> {
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
   
  }


  updateProduct(product : any){
    const btnClose = document.getElementById('btnClose');
     console.log(product)
    if (this.selectedFile) {
      this.convertFileToBase64StringUpdate(this.selectedFile).then(base64String => {
        // Aquí puedes enviar el byteArray al backend
        var producto : any = { id : product.id, 
          description:product.descripcion,
          name : product.nombre,
          price : parseInt(product.precio),
          stock : parseInt(product.stock),
          type : parseInt(product.subCategoriaId),
          image : base64String,
          code:parseInt(product.codigo)
        }
        this.productService.update(producto).subscribe( response => {
          btnClose?.click()
          this.getProductos()
        })
      }).catch(error => {
        console.error('Error converting file:', error);
      });
    }
    
    
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
