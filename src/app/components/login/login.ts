import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  username = '';
  password = '';

  constructor(private authService: AuthService) {}

  login(): void {

    console.log('Calling login API...');

    this.authService.login(
      this.username,
      this.password
    ).subscribe({


      next: (response) => {

        console.log('Login successful!');
        console.log('Response:', response);

        this.authService.saveSession(response);

        console.log('JWT stored successfully');
        console.log('User stored:', response.user);

      },

      error: (error) => {

        console.error('Login failed:', error);

      }

    });
  }
}