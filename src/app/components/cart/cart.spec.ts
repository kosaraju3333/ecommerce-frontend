import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { CartComponent } from './cart';
import { CartService } from '../../services/cart';
import { OrderService } from '../../services/order';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;

  const mockCartService = {
    getCart: vi.fn().mockReturnValue(
      of({
        cart_id: 1,
        items: [],
        total: 0
      })
    ),

    updateQuantity: vi.fn(),
    removeItem: vi.fn()
  };

  const mockOrderService = {
    checkout: vi.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartComponent],
      providers: [
        provideRouter([]),
        {
          provide: CartService,
          useValue: mockCartService
        },
        {
          provide: OrderService,
          useValue: mockOrderService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cart on initialization', () => {
    expect(mockCartService.getCart).toHaveBeenCalled();

    expect(component.cart).toEqual({
      cart_id: 1,
      items: [],
      total: 0
    });

    expect(component.loading).toBe(false);
  });

  it('should not decrease quantity below 1', () => {
    const item = {
      cart_item_id: 1,
      product_id: 1,
      name: 'iPhone 17',
      price: 79999,
      image_url: '/images/iphone-17.jpg',
      quantity: 1,
      subtotal: 79999
    };

    component.decreaseQuantity(item);

    expect(
      mockCartService.updateQuantity
    ).not.toHaveBeenCalled();
  });
});