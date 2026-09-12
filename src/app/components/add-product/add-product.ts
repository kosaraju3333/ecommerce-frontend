import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Product } from '../../models/product';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css'
})
export class AddProduct {

  product: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    sku: '',
    category: '',
    image_url: '',
    rating: 0,
    stock_quantity: 0,
    is_active: true
  };

  constructor(private productService: ProductService) {}

  addProduct(): void {

    console.log('Sending product:', this.product);

    this.productService.createProduct(this.product).subscribe({

      next: (response) => {
        console.log('Product created successfully:', response);

        alert('Product added successfully!');

        this.resetForm();
      },

      error: (error) => {
        console.error('Error creating product:', error);

        alert('Failed to add product');
      }

    });
  }

  resetForm(): void {

    this.product = {
      id: 0,
      name: '',
      description: '',
      price: 0,
      sku: '',
      category: '',
      image_url: '',
      rating: 0,
      stock_quantity: 0,
      is_active: true
    };

  }
}