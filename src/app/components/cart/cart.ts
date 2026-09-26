import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  CartService,
  Cart,
  CartItem
} from '../../services/cart';

import {
  OrderService,
  Order
} from '../../services/order';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent implements OnInit {

  cart: Cart | null = null;
  loading = true;

  checkingOut = false;
  checkoutError = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private cdr: ChangeDetectorRef,
    private router: Router

  ) {}


  ngOnInit(): void {
    this.loadCart();
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }


  loadCart(): void {

    this.loading = true;

    this.cartService.getCart().subscribe({

      next: (data) => {

        console.log('Cart received:', data);

        this.cart = data;
        this.loading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error('Failed to load cart:', error);

        this.loading = false;

        alert('Failed to load cart');

        this.cdr.detectChanges();
      }

    });
  }

  increaseQuantity(item: CartItem): void {

    const newQuantity = item.quantity + 1;

    this.cartService
      .updateQuantity(item.cart_item_id, newQuantity)
      .subscribe({

        next: () => {
          console.log('Quantity increased');
          this.loadCart();
        },

        error: (error) => {
          console.error('Failed to increase quantity:', error);

          if (error.error?.detail) {
            alert(error.error.detail);
          }
        }

      });
  }

  decreaseQuantity(item: CartItem): void {

  if (item.quantity <= 1) {
    return;
  }

  const newQuantity = item.quantity - 1;

    this.cartService
      .updateQuantity(item.cart_item_id, newQuantity)
      .subscribe({

        next: () => {
          console.log('Quantity decreased');
          this.loadCart();
        },

        error: (error) => {
          console.error('Failed to decrease quantity:', error);

          if (error.error?.detail) {
            alert(error.error.detail);
          }
        }

      });
  }

  removeItem(item: CartItem): void {

    const confirmed = confirm(
      `Remove ${item.name} from your cart?`
    );

    if (!confirmed) {
      return;
    }

    this.cartService
      .removeItem(item.cart_item_id)
      .subscribe({

        next: () => {
          console.log('Item removed from cart');
          this.loadCart();
        },

        error: (error) => {
          console.error('Failed to remove item:', error);
          alert('Failed to remove item');
        }

      });
  }

  checkout(): void {

    if (!this.cart || this.cart.items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    const confirmed = confirm(
      `Place order for ₹${this.cart.total}?`
    );

    if (!confirmed) {
      return;
    }

    this.checkingOut = true;
    this.checkoutError = '';

    this.orderService.checkout().subscribe({

      next: (order: Order) => {

        console.log(
          'Order placed:',
          order
        );

        this.checkingOut = false;

        alert(
          `Order #${order.id} placed successfully!`
        );

        // Reload because backend cleared the cart
        this.loadCart();
      },

      error: (error) => {

        console.error(
          'Checkout failed:',
          error
        );

        this.checkingOut = false;

        if (error.error?.detail) {
          this.checkoutError =
            error.error.detail;
        } else {
          this.checkoutError =
            'Checkout failed. Please try again.';
        }

        this.cdr.detectChanges();
      }

    });
  }


}