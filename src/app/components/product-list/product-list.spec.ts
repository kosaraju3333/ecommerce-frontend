import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { ProductList } from './product-list';
import { ProductService } from '../../services/product';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';
import { Product } from '../../models/product';

describe('ProductList', () => {

  let component: ProductList;
  let fixture: ComponentFixture<ProductList>;

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
      is_active: true
    },
    {
      id: 2,
      name: 'Samsung Galaxy A37',
      description: 'Samsung smartphone',
      price: 45999,
      sku: 'SamsungA37-001',
      category: 'Smartphones',
      image_url: '/images/SamsungA37.jpg',
      rating: 4.5,
      stock_quantity: 15,
      is_active: true
    }
  ];

  const mockProductService = {
    getProducts: vi.fn(),
    deleteProduct: vi.fn()
  };

  const mockAuthService = {
    isAdmin: vi.fn(),
    isLoggedIn: vi.fn(),
    logout: vi.fn()
  };

  const mockCartService = {
    addToCart: vi.fn(),
    getCart: vi.fn()
  };

  const mockRouter = {
    navigate: vi.fn()
  };

  beforeEach(async () => {

    vi.clearAllMocks();

    mockProductService.getProducts.mockReturnValue(
      of(mockProducts)
    );

    mockProductService.deleteProduct.mockReturnValue(
      of({
        message: 'Product deleted successfully',
        product_id: 1
      })
    );

    mockAuthService.isAdmin.mockReturnValue(false);
    mockAuthService.isLoggedIn.mockReturnValue(false);

    mockCartService.addToCart.mockReturnValue(
      of({
        message: 'Product added to cart'
      })
    );

    mockCartService.getCart.mockReturnValue(
      of({
        cart_id: 1,
        items: [],
        total: 0
      })
    );

    await TestBed.configureTestingModule({
      imports: [ProductList],

      providers: [
        {
          provide: ProductService,
          useValue: mockProductService
        },
        {
          provide: AuthService,
          useValue: mockAuthService
        },
        {
          provide: CartService,
          useValue: mockCartService
        },
        {
          provide: Router,
          useValue: mockRouter
        }
      ]

    }).compileComponents();

    fixture = TestBed.createComponent(ProductList);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should load products on initialization', () => {

    expect(
      mockProductService.getProducts
    ).toHaveBeenCalled();

    expect(component.products.length).toBe(2);

    expect(component.products[0].name)
      .toBe('iPhone 17');

  });


  it('should not load cart when user is not logged in', () => {

    expect(
      mockCartService.getCart
    ).not.toHaveBeenCalled();

  });


  it('should identify admin user', () => {

    mockAuthService.isAdmin.mockReturnValue(true);

    expect(component.isAdmin()).toBe(true);

  });


  it('should identify logged in user', () => {

    mockAuthService.isLoggedIn.mockReturnValue(true);

    expect(component.isLoggedIn()).toBe(true);

  });


  it('should navigate to add product page', () => {

    component.goToAddProduct();

    expect(
      mockRouter.navigate
    ).toHaveBeenCalledWith([
      '/add-product'
    ]);

  });


  it('should navigate to edit product page', () => {

    component.editProduct(mockProducts[0]);

    expect(
      mockRouter.navigate
    ).toHaveBeenCalledWith([
      '/edit-product',
      1
    ]);

  });


  it('should logout and navigate to login', () => {

    component.logout();

    expect(
      mockAuthService.logout
    ).toHaveBeenCalled();

    expect(
      mockRouter.navigate
    ).toHaveBeenCalledWith([
      '/login'
    ]);

  });


  it('should add product to cart', () => {

    component.addToCart(mockProducts[0]);

    expect(
      mockCartService.addToCart
    ).toHaveBeenCalledWith(
      1,
      1
    );

  });


  it('should calculate cart count', () => {

    mockCartService.getCart.mockReturnValue(
      of({
        cart_id: 1,

        items: [
          {
            cart_item_id: 1,
            product_id: 1,
            name: 'iPhone 17',
            price: 79999,
            image_url: '/images/iphone-17.jpg',
            quantity: 2,
            subtotal: 159998
          },
          {
            cart_item_id: 2,
            product_id: 2,
            name: 'Samsung Galaxy A37',
            price: 45999,
            image_url: '/images/SamsungA37.jpg',
            quantity: 3,
            subtotal: 137997
          }
        ],

        total: 297995
      })
    );

    component.loadCartCount();

    expect(component.cartCount).toBe(5);

  });


  it('should navigate to cart', () => {

    component.goToCart();

    expect(
      mockRouter.navigate
    ).toHaveBeenCalledWith([
      '/cart'
    ]);

  });


  it('should navigate to orders', () => {

    component.goToOrders();

    expect(
      mockRouter.navigate
    ).toHaveBeenCalledWith([
      '/orders'
    ]);

  });

});