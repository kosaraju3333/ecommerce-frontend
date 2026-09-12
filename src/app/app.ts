// import { Component } from '@angular/core';

// import { ProductList } from './components/product-list/product-list';
// import { AddProduct } from './components/add-product/add-product';


// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [ProductList, AddProduct],
//   templateUrl: './app.html',
//   styleUrl: './app.css'
// })
// export class App {
// }

import { Component } from '@angular/core';
import { Login } from './components/login/login';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Login],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}

