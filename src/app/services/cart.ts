import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface CartItem {

  cart_item_id: number;
  product_id: number;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  subtotal: number;

}


export interface Cart {

  cart_id?: number;
  items: CartItem[];
  total: number;

}


@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = 'http://localhost:8003/api/cart';

  constructor(private http: HttpClient) {}


  addToCart(
    productId: number,
    quantity: number = 1
  ): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/items`,
      {
        product_id: productId,
        quantity: quantity
      }
    );
  }


  getCart(): Observable<Cart> {

    return this.http.get<Cart>(
      `${this.apiUrl}/`
    );
  }


  updateQuantity(
    cartItemId: number,
    quantity: number
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/items/${cartItemId}`,
      {
        quantity: quantity
      }
    );
  }


  removeItem(
    cartItemId: number
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/items/${cartItemId}`
    );
  }

}