import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import Swal from 'sweetalert2';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, 
    MatFormFieldModule,
    MatInputModule, 
    ReactiveFormsModule,
    MatCardModule,
  MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  password = new FormControl('', [Validators.required, Validators.email]);
  email = new FormControl('', [Validators.required, Validators.email]);

  matcher = new MyErrorStateMatcher();
  
  constructor( private dialog: MatDialog,private authService: AuthService, private router:Router,private userService: UserService,) {}
  
  login() {
    if (this.email.value != null && this.password.value) {
      this.authService.login(this.email.value, this.password.value).subscribe({
        next: (response)=> {
          Swal.fire({
            title: "Inicio Sesion",
            text: "Inicio de sesion exitoso, Usuario: "+ response.logedUser.email,
            icon: "success"
          });
          this.userService.setUser(response.logedUser.email)
          this.router.navigate(['/administracion'])
          this.dialog.closeAll()
        }
          ,
        error: (err) => {
          Swal.fire({
          icon: "error",
          title: "Error al ingresar",
          text: err.error.message,
          
        })}
      });
    }
    
  }
}
