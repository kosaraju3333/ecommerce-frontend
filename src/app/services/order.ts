import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  price: string;
  quantity: number;
  subtotal: string;
}


export interface Order {
  id: number;
  user_id: number;
  status: string;
  total_amount: string;
  created_at: string;
  items: OrderItem[];
}


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl =
    'http://localhost:8004/api/orders';

  constructor(
    private http: HttpClient
  ) {}


  checkout(): Observable<Order> {

    return this.http.post<Order>(
      `${this.apiUrl}/checkout`,
      {}
    );
  }


  getOrders(): Observable<Order[]> {

    return this.http.get<Order[]>(
      `${this.apiUrl}/`
    );
  }


  getOrder(orderId: number): Observable<Order> {

    return this.http.get<Order>(
      `${this.apiUrl}/${orderId}`
    );
  }
}