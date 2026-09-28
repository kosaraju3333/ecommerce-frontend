import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { OrdersComponent } from './orders';
import { OrderService } from '../../services/order';

describe('OrdersComponent', () => {
  let component: OrdersComponent;
  let fixture: ComponentFixture<OrdersComponent>;

  const mockOrders = [
    {
      id: 1,
      user_id: 2,
      status: 'PLACED',
      total_amount: '79999.00',
      created_at: '2026-09-28T10:00:00',
      items: [
        {
          id: 1,
          product_id: 1,
          product_name: 'iPhone 17',
          price: '79999.00',
          quantity: 1,
          subtotal: '79999.00'
        }
      ]
    }
  ];

  const mockOrderService = {
    getOrders: vi.fn().mockReturnValue(
      of(mockOrders)
    )
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersComponent],
      providers: [
        provideRouter([]),
        {
          provide: OrderService,
          useValue: mockOrderService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load orders on initialization', () => {
    expect(
      mockOrderService.getOrders
    ).toHaveBeenCalled();

    expect(component.orders.length).toBe(1);

    expect(component.orders[0].status).toBe(
      'PLACED'
    );

    expect(component.loading).toBe(false);
  });
});