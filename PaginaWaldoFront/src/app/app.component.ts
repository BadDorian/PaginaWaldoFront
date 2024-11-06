import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from "./components/nav-bar/nav-bar.component";
import { AuthService } from './services/auth/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from './services/product/product.service';
import { FooterComponent } from "./components/footer/footer.component";
import { CartShoppingService } from './services/cart-shopping/cart-shopping.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent, HttpClientModule, FooterComponent],
  providers:[AuthService,ProductService,CartShoppingService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'PaginaWaldoFront';
}
