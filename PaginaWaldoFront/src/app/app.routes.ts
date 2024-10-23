import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AdministracionComponent } from './pages/administracion/administracion.component';
import { authGuard } from './guards/auth/auth.guard';
import { ProductoComponent } from './pages/producto/producto.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { CarritoComprasComponent } from './pages/carrito-compras/carrito-compras.component';
import { ProductosCategoriaComponent } from './pages/productos-categoria/productos-categoria.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'administracion',
        canActivate: [authGuard],
        component: AdministracionComponent
    },
    {   path: 'product/:id', 
        component: ProductoComponent 
    }
    ,
    { 
        path: 'category/:categoryId', 
        component: ProductosCategoriaComponent 
    },
    { 
        path: 'subCategory/:subCategoryId', 
        component: ProductosComponent 
    },
    {
        path : 'carrito',
        component: CarritoComprasComponent
    }
];
