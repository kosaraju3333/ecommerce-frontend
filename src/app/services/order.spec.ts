import { environment } from '../../environments/environment';

import { TestBed } from '@angular/core/testing';
import {
  provideHttpClient,
} from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';

import { OrderService } from './order';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrderService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should checkout cart', () => {
    service.checkout().subscribe((order) => {
      expect(order.id).toBe(1);
      expect(order.status).toBe('PLACED');
      expect(order.total_amount).toBe('79999.00');
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/api/orders/checkout`
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});

    req.flush({
      id: 1,
      user_id: 1,
      status: 'PLACED',
      total_amount: '79999.00',
      created_at: '2026-09-28T10:00:00',
      items: [],
    });
  });

  it('should get orders', () => {
    service.getOrders().subscribe((orders) => {
      expect(orders.length).toBe(1);
      expect(orders[0].status).toBe('PLACED');
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/api/orders/`
    );

    expect(req.request.method).toBe('GET');

    req.flush([
      {
        id: 1,
        user_id: 1,
        status: 'PLACED',
        total_amount: '79999.00',
        created_at: '2026-09-28T10:00:00',
        items: [],
      },
    ]);
  });

  it('should get order by id', () => {
    service.getOrder(5).subscribe((order) => {
      expect(order.id).toBe(5);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/api/orders/5`
    );

    expect(req.request.method).toBe('GET');

    req.flush({
      id: 5,
      user_id: 1,
      status: 'PLACED',
      total_amount: '150000.00',
      created_at: '2026-09-28T10:00:00',
      items: [],
    });
  });
});