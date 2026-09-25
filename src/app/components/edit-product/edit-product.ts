import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Product } from '../../models/product';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.css'
})
export class EditProduct implements OnInit {

  product: Product | null = null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef

  ) {}

  ngOnInit(): void {

    const productId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    console.log('Product ID:', productId);

    this.loadProduct(productId);
  }

  loadProduct(productId: number): void {

    console.log('Loading product...');

    this.productService.getProduct(productId).subscribe({

      next: (data) => {

        console.log('Product received:', data);

        this.product = data;

        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error('Failed to load product:', error);

        alert('Product not found');

        this.router.navigate(['/products']);
      }

    });
  }
  updateProduct(): void {

    if (!this.product) {
      return;
    }

    console.log('Updating product:', this.product);

    this.productService
      .updateProduct(this.product.id, this.product)
      .subscribe({

        next: (response) => {

          console.log('Product updated successfully:', response);

          alert('Product updated successfully');

          this.router.navigate(['/products']);
        },

        error: (error) => {

          console.error('Failed to update product:', error);

          alert('Failed to update product');
        }

      });
  }
}