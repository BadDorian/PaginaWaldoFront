import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth/auth.guard';
import { AdminComponent } from './pages/admin/admin.component';
import { ProductComponent } from './pages/product/product.component';
import { CategorieProductsComponent } from './pages/categorie-products/categorie-products.component';

import { SubCategoriesProductsComponent } from './pages/sub-categories-products/sub-categories-products.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    /*{
        path: 'login',
        component: LoginComponent
    },*/
    {
        path: 'administracion',
        canActivate: [authGuard],
        component: AdminComponent
    },
    {   path: 'product/:id', 
        component: ProductComponent 
    }
    ,
    { 
        path: 'category/:categoryId', 
        component: CategorieProductsComponent 
    },
    { 
        path: 'subCategory/:subCategoryId', 
        component: SubCategoriesProductsComponent 
    },
    {
        path : 'carrito',
        component: CartPageComponent
    }
];
