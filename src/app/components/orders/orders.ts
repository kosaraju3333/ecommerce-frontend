import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  OrderService,
  Order
} from '../../services/order';


@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class OrdersComponent implements OnInit {

  orders: Order[] = [];

  loading = true;

  errorMessage = '';


  constructor(
    private orderService: OrderService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {
    this.loadOrders();
  }


  loadOrders(): void {

    this.loading = true;
    this.errorMessage = '';

    this.orderService.getOrders().subscribe({

      next: (data) => {

        console.log(
          'Orders received:',
          data
        );

        this.orders = data;
        this.loading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'Failed to load orders:',
          error
        );

        this.loading = false;

        if (error.error?.detail) {
          this.errorMessage =
            error.error.detail;
        } else {
          this.errorMessage =
            'Failed to load orders';
        }

        this.cdr.detectChanges();
      }

    });
  }


  goToProducts(): void {
    this.router.navigate(['/products']);
  }

}