// import { Routes } from '@angular/router';

// export const routes: Routes = [];

import { Routes } from '@angular/router';

import { Login } from './components/login/login';
import { ProductList } from './components/product-list/product-list';
import { AddProduct } from './components/add-product/add-product';
import { EditProduct } from './components/edit-product/edit-product';

import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register')
        .then(m => m.Register)
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'products',
    component: ProductList
  },
  {
    path: 'add-product',
    component: AddProduct,
    canActivate: [adminGuard]

  },
  {
    path: 'edit-product/:id',
    component: EditProduct,
    canActivate: [adminGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
  path: 'cart',
  loadComponent: () =>
    import('./components/cart/cart')
      .then(m => m.CartComponent)
  },
  {
  path: 'orders',

  loadComponent: () =>
    import(
      './components/orders/orders'
    )
    .then(
      m => m.OrdersComponent
    )
  }

];