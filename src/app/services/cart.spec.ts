import { TestBed } from '@angular/core/testing';
import {
  provideHttpClient,
} from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';

import { CartService } from './cart';

describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CartService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add product to cart', () => {
    service.addToCart(1, 2).subscribe((response) => {
      expect(response.product_id).toBe(1);
      expect(response.quantity).toBe(2);
    });

    const req = httpMock.expectOne(
      'http://localhost:8003/api/cart/items'
    );

    expect(req.request.method).toBe('POST');

    expect(req.request.body).toEqual({
      product_id: 1,
      quantity: 2,
    });

    req.flush({
      message: 'Product added to cart',
      product_id: 1,
      quantity: 2,
    });
  });

  it('should get cart', () => {
    service.getCart().subscribe((cart) => {
      expect(cart.items.length).toBe(1);
      expect(cart.total).toBe(159998);
    });

    const req = httpMock.expectOne(
      'http://localhost:8003/api/cart/'
    );

    expect(req.request.method).toBe('GET');

    req.flush({
      cart_id: 1,
      items: [
        {
          cart_item_id: 1,
          product_id: 1,
          name: 'iPhone 17',
          price: 79999,
          image_url: '/images/iphone-17.jpg',
          quantity: 2,
          subtotal: 159998,
        },
      ],
      total: 159998,
    });
  });

  it('should update cart quantity', () => {
    service.updateQuantity(10, 5).subscribe((response) => {
      expect(response.quantity).toBe(5);
    });

    const req = httpMock.expectOne(
      'http://localhost:8003/api/cart/items/10'
    );

    expect(req.request.method).toBe('PUT');

    expect(req.request.body).toEqual({
      quantity: 5,
    });

    req.flush({
      message: 'Cart updated',
      cart_item_id: 10,
      quantity: 5,
    });
  });

  it('should remove item from cart', () => {
    service.removeItem(10).subscribe((response) => {
      expect(response.message).toBe(
        'Product removed from cart'
      );
    });

    const req = httpMock.expectOne(
      'http://localhost:8003/api/cart/items/10'
    );

    expect(req.request.method).toBe('DELETE');

    req.flush({
      message: 'Product removed from cart',
    });
  });
});