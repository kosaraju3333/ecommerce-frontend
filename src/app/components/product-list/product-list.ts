import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


import { Product } from '../../models/product';
import { ProductService } from '../../services/product';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {

  products: Product[] = [];
  cartCount: number = 0;

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  goToAddProduct(): void {
    this.router.navigate(['/add-product']);
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {

    this.authService.logout();

    this.router.navigate(['/login']);
  }


  ngOnInit(): void {
    this.loadProducts();

    if (this.authService.isLoggedIn()) {
      this.loadCartCount();
    }
  }

  loadProducts(): void {

    console.log('1. Calling API...');

    this.productService.getProducts().subscribe({
      next: (data) => {
        console.log('2. API response:', data);
        console.log('3. Number received:', data.length);
        // console.log('Products received:', data);

        this.products = data;


        // console.log('Products assigned:', this.products);
        console.log('4. Products after assignment:', this.products);
        console.log('5. Products length:', this.products.length);

        this.cdr.detectChanges();
      },

      error: (error) => {
        // console.error('Error loading products:', error);
        console.error('API ERROR:', error);

      }
    });

  }


  editProduct(product: Product): void {
    console.log('Edit product:', product);
    
    this.router.navigate(['/edit-product', product.id]);
  }

  deleteProduct(product: Product): void {

    const confirmed = confirm(
      `Are you sure you want to delete ${product.name}?`
    );

    if (!confirmed) {
      return;
    }

    this.productService.deleteProduct(product.id).subscribe({

      next: (response) => {

      console.log('Delete response:', response);

      alert('Product deleted successfully!');

      this.loadProducts();
    },

    error: (error) => {

      console.error('Delete failed:', error);

      alert('Failed to delete product');
    }

  });

  }

  addToCart(product: Product): void {

    console.log('Adding product to cart:', product);

    this.cartService
      .addToCart(product.id, 1)
      .subscribe({

        next: (response) => {

          console.log(
            'Product added to cart:',
            response
          );

          this.loadCartCount();

          alert(`${product.name} added to cart!`);
        },

        error: (error) => {

          console.error(
            'Failed to add product to cart:',
            error
          );

          if (error.status === 401) {
            alert('Please login to add products to cart');
            return;
          }

          if (error.error?.detail) {
            alert(error.error.detail);
            return;
          }

          alert('Failed to add product to cart');
        }

      });
  }

  loadCartCount(): void {

    this.cartService.getCart().subscribe({

      next: (cart) => {

        this.cartCount = cart.items.reduce(
          (total, item) => total + item.quantity,
          0
        );

        console.log('Cart count:', this.cartCount);

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Failed to load cart count:', error);
      }

    });
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  
}