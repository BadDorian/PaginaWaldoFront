import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { ProductService } from '../../services/product/product.service';
@Component({
  selector: 'app-edit-product-modal',
  standalone: true,
  imports: [MatDialogModule,MatButtonModule, CommonModule, FormsModule],
  templateUrl: './edit-product-modal.component.html',
  styleUrl: './edit-product-modal.component.scss'
})
export class EditProductModalComponent implements AfterViewInit {
  selectedItem: any = {  };
  selectedFile: File | null = null;
  uploadedImage: string | ArrayBuffer | null = null;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router:Router,private userService: UserService, private authService : AuthService, private productService : ProductService) {
    console.log('Datos recibidos:', data);
  }
  ngAfterViewInit(): void {
    this.selectedItem = this.data
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
          
        })
      }).catch(error => {
        console.error('Error converting file:', error);
      });
    }
    
    
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
  createImageFromByteArray(base64String: string): string {
    return `data:image/jpeg;base64,${base64String}`;
  }
  
}
