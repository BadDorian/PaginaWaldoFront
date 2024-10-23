import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  
  constructor(private authService: AuthService, private router:Router,private userService: UserService,) {}
  
  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response)=> {
        Swal.fire({
          title: "Inicio Sesion",
          text: "Inicio de sesion exitoso, Usuario: "+ response.logedUser.email,
          icon: "success"
        });
        this.userService.setUser(response.logedUser.email)
        this.router.navigate(['/administracion'])
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
