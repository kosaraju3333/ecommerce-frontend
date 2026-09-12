import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


import { Product } from '../../models/product';
import { ProductService } from '../../services/product';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {

  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router
  ) {}

  goToAddProduct(): void {
    this.router.navigate(['/add-product']);
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  ngOnInit(): void {
    this.loadProducts();
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

}