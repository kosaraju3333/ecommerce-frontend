import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}


// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';

// import { Login } from './components/login/login';
// import { ProductList } from './components/product-list/product-list';
// import { AddProduct } from './components/add-product/add-product';

// import { AuthService } from './services/auth';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [
//     CommonModule,
//     Login,
//     ProductList,
//     AddProduct
//   ],
//   templateUrl: './app.html',
//   styleUrl: './app.css'
// })
// export class App {

//   constructor(public authService: AuthService) {}

// }