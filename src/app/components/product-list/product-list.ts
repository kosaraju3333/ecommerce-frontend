// import { Component, OnInit } from '@angular/core';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Product } from '../../models/product';
import { ProductService } from '../../services/product';

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
    private cdr: ChangeDetectorRef
  ) {}

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
}