import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  username = '';
  email = '';
  password = '';

  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register(): void {

    this.errorMessage = '';

    console.log('Calling registration API...');

    this.authService.register(
      this.username,
      this.email,
      this.password
    ).subscribe({

      next: (response) => {

        console.log(
          'Registration successful:',
          response
        );

        alert('Registration successful! Please login.');

        this.router.navigate(['/login']);
      },

      error: (error) => {

        console.error(
          'Registration failed:',
          error
        );

        if (error.error?.detail) {
          this.errorMessage = error.error.detail;
          return;
        }

        this.errorMessage = 'Registration failed';
      }

    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}