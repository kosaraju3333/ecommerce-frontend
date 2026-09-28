import { TestBed } from '@angular/core/testing';
import {
  provideHttpClient,
} from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';

import { ProductService } from './product';
import { Product } from '../models/product';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all products', () => {
    const mockProducts: Product[] = [
      {
        id: 1,
        name: 'iPhone 17',
        description: 'Apple smartphone',
        price: 79999.00,
        sku: 'IPHONE17-001',
        category: 'Smartphones',
        image_url: '/images/iphone-17.jpg',
        rating: 4.5,
        stock_quantity: 25,
        is_active: true,
      },
    ];

    service.getProducts().subscribe((products) => {
      expect(products.length).toBe(1);
      expect(products[0].name).toBe('iPhone 17');
    });

    const req = httpMock.expectOne(
      'http://localhost:8002/api/products/'
    );

    expect(req.request.method).toBe('GET');

    req.flush(mockProducts);
  });

  it('should get product by id', () => {
    service.getProduct(1).subscribe((product) => {
      expect(product.id).toBe(1);
      expect(product.name).toBe('iPhone 17');
    });

    const req = httpMock.expectOne(
      'http://localhost:8002/api/products/1'
    );

    expect(req.request.method).toBe('GET');

    req.flush({
      id: 1,
      name: 'iPhone 17',
      description: 'Apple smartphone',
      price: '79999.00',
      sku: 'IPHONE17-001',
      category: 'Smartphones',
      image_url: '/images/iphone-17.jpg',
      rating: 4.5,
      stock_quantity: 25,
      is_active: true,
    });
  });

  it('should create product', () => {
    const product: Product = {
      id: 3,
      name: 'MacBook Pro',
      description: 'Apple laptop',
      price: 150000.00,
      sku: 'MAC-001',
      category: 'Laptops',
      image_url: '/images/macbook.jpg',
      rating: 4.5,
      stock_quantity: 10,
      is_active: true,
    };

    service.createProduct(product).subscribe((response) => {
      expect(response.name).toBe('MacBook Pro');
    });

    const req = httpMock.expectOne(
      'http://localhost:8002/api/products/'
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(product);

    req.flush(product);
  });

  it('should update product', () => {
    const product: Product = {
      id: 1,
      name: 'Updated iPhone',
      description: 'Updated',
      price: 85000.00,
      sku: 'IPHONE17-001',
      category: 'Smartphones',
      image_url: '/images/iphone-17.jpg',
      rating: 4.8,
      stock_quantity: 30,
      is_active: true,
    };

    service.updateProduct(1, product).subscribe((response) => {
      expect(response.name).toBe('Updated iPhone');
    });

    const req = httpMock.expectOne(
      'http://localhost:8002/api/products/1'
    );

    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(product);

    req.flush(product);
  });

  it('should delete product', () => {
    service.deleteProduct(1).subscribe((response) => {
      expect(response.message).toBe(
        'Product deleted successfully'
      );
    });

    const req = httpMock.expectOne(
      'http://localhost:8002/api/products/1'
    );

    expect(req.request.method).toBe('DELETE');

    req.flush({
      message: 'Product deleted successfully',
      product_id: 1,
    });
  });
});