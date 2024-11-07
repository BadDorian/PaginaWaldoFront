import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import {MatSidenavModule, MatDrawerContainer} from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {  MatToolbarModule } from '@angular/material/toolbar';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth/auth.service';
import { ProductService } from './services/product/product.service';
import { CartShoppingService } from './services/cart-shopping/cart-shopping.service';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { CommonModule } from '@angular/common';
import { UserService } from './services/user/user.service';
import { Subscription } from 'rxjs';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule} from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatMenuModule} from '@angular/material/menu';
import { LoginComponent } from './pages/login/login.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import Swal from 'sweetalert2';

/** Estructura del nodo con categorías y subcategorías */
interface CategoryNode {
  descripcion: string;
  id: number;
  subCategorias?: CategoryNode[];
}

/** Estructura de los nodos "planos" utilizados por el árbol */
interface FlatNode {
  expandable: boolean;
  descripcion: string;
  level: number;
  id: number;
}


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    MatSidenavModule,
    MatDrawerContainer, 
    MatButtonModule, 
    MatIconModule, 
    MatToolbarModule,
    HttpClientModule,
    ShoppingCartComponent,
    CommonModule,
    RouterModule,
    MatTreeModule,
    MatTooltipModule,
    MatMenuModule,
  LoginComponent,MatDialogModule],
  providers:[AuthService,
    ProductService,
    CartShoppingService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit,OnDestroy{
  isCartVisible: boolean = false;
  carritoItems: any[] = [];
  sessionId: string;
  subCategories: any[] = [];
  currentUser: string | null = null;
  categories: any[] = [];
  groupedSubCategories: { [key: string]: any[] } = {};
  private userSubscription: Subscription | undefined;
  
  /** Controlador del árbol */
  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,  // Nivel del nodo
    node => node.expandable  // Si es expandible o no
  );
 /** Flattenador para convertir nodos con hijos en nodos planos */
 treeFlattener = new MatTreeFlattener(
  (node: CategoryNode, level: number) => ({
    descripcion: node.descripcion,
    id : node.id,
    level: level,
    expandable: !!node.subCategorias && node.subCategorias.length > 0
  }),
  node => node.level,
  node => node.expandable,
  node => node.subCategorias
);

  /** Data source para el árbol */
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  title = 'paginaWaldoFrontMaterial';

  constructor(
    private dialog: MatDialog,
    private router: Router,
    public authService: AuthService,
    private productService: ProductService,
    private shoppingCartService: CartShoppingService,
    private userService: UserService
  ) {
    this.sessionId = localStorage.getItem('sessionId')!
  }

  
  ngOnInit(): void {
    /*this.userSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      console.log(this.currentUser)
    });*/
    this.shoppingCartService.carrito$.subscribe(items => {
      this.carritoItems = items;
    });

    this.shoppingCartService.obtenerCarrito(this.sessionId);

    this.productService.getCategories().subscribe(response => {
      this.categories = response;
      
      this.productService.getSubCategories().subscribe(subCategories => {
        if (subCategories != null || subCategories != undefined ) {
          this.subCategories = subCategories;
          this.groupCategoriesByType(this.subCategories);
          this.dataSource.data = this.categories
        }
        
        
      });
    });

    this.currentUser = this.userService.getUser()
    console.log(this.currentUser)
    this.userService.user$.subscribe(user => {
      this.currentUser = user;
      
    });
    
  }


  /** Determina si el nodo tiene hijos o no */
  hasChild = (_: number, node: FlatNode) => node.expandable;
  // Navegación
  NavigateHome() {
    this.router.navigate(['/']);
  }

  NavigateAdmin() {
    this.router.navigate(['/administracion']);
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }


  groupCategoriesByType(subCategorias : any[]){
    this.categories.forEach((categoria) => {
      subCategorias.forEach((subCategoria) => {
        if (categoria.id == subCategoria.tipoProductoId) {
          if (categoria.subCategorias == null) {
            categoria.subCategorias = []
          }
          categoria.subCategorias.push(subCategoria)
        }
      })
     
    })

    
  }


  // Método para alternar la visibilidad del carrito
  toggleCart() {
    this.isCartVisible = !this.isCartVisible;
  }
 
  logout() {
    this.userService.clearUser();
    this.currentUser = null;
    this.authService.logout()
    // Puedes redirigir al usuario a la página de login o al inicio
  }

  openLoginModal() {
  
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '400px',
       // Pasar datos al modal si es necesario
    });
 
    
  }

}
