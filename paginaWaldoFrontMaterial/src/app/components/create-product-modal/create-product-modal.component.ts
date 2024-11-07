import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { ProductService } from '../../services/product/product.service';
import { CommonModule } from '@angular/common';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-create-product-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule,FormsModule],
  templateUrl: './create-product-modal.component.html',
  styleUrl: './create-product-modal.component.scss'
})
export class CreateProductModalComponent {

  selectedFile: File | null = null;
  
  uploadedImage: string | ArrayBuffer | null = null;
 
  description: string = '';
  name: string = '';
  code: number = 0;
  price : number = 0;
  stock: number = 0;
  type : number = 0;
  constructor( private router:Router,private userService: UserService, private authService : AuthService, private productService : ProductService) {
    
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

  createProduct() {
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
            
            
          })
      }).catch(error => {
        console.error('Error converting file:', error);
      });
    }
  }

 

  createImageFromByteArray(base64String: string): string {
    return `data:image/jpeg;base64,${base64String}`;
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
 
}
