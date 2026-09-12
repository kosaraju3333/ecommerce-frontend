import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:8000/api/products/';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProduct(productId: number): Observable<Product> {
    return this.http.get<Product>(
      `${this.apiUrl}${productId}`
    );
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(
    productId: number,
    product: Product
  ): Observable<Product> {

    return this.http.put<Product>(
      `${this.apiUrl}${productId}`,
      product
    );
  }

  deleteProduct(productId: number): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}${productId}`
    );
  }
}