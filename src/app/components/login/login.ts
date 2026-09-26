import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  username = '';
  password = '';

  errorMessage = '';
  loading = false;


  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}


  // login(): void {

  //   // Remove previous error message
  //   this.errorMessage = '';

  //   // Validate username
  //   if (!this.username.trim()) {
  //     this.errorMessage = 'Username is required';
  //     return;
  //   }

  //   // Validate password
  //   if (!this.password) {
  //     this.errorMessage = 'Password is required';
  //     return;
  //   }

  //   this.loading = true;

  //   console.log('Calling login API...');

  //   this.authService.login(
  //     this.username,
  //     this.password
  //   ).subscribe({

  //     next: (response) => {

  //       console.log('Login successful!');
  //       console.log('Response:', response);

  //       this.authService.saveSession(response);

  //       console.log('JWT stored successfully');
  //       console.log('User stored:', response.user);

  //       this.loading = false;

  //       // Redirect to products
  //       this.router.navigate(['/products']);
  //     },

  //     error: (error) => {

  //       console.error('Login failed:', error);

  //       this.loading = false;

  //       // Wrong username or password
  //       if (error.status === 401) {

  //         this.errorMessage =
  //           'Invalid username or password';

  //         return;
  //       }

  //       // Inactive account
  //       if (error.status === 403) {

  //         this.errorMessage =
  //           'Your account is inactive';

  //         return;
  //       }

  //       // Auth microservice unavailable
  //       if (error.status === 0) {

  //         this.errorMessage =
  //           'Unable to connect to authentication service';

  //         return;
  //       }

  //       this.errorMessage =
  //         'Login failed. Please try again.';
  //     }

  //   });
  // }

  login(): void {

    this.errorMessage = '';

    if (!this.username.trim()) {
      this.errorMessage = 'Username is required';
      return;
    }

    if (!this.password) {
      this.errorMessage = 'Password is required';
      return;
    }

    this.loading = true;

    console.log('Calling login API...');

    this.authService.login(
      this.username,
      this.password
    ).subscribe({

      next: (response) => {

        console.log('Login successful!');

        this.authService.saveSession(response);

        this.loading = false;

        this.router.navigate(['/products']);
      },

      error: (error) => {

        console.error('Login failed:', error);

        this.loading = false;

        if (error.status === 401) {

          this.errorMessage =
            'Invalid username or password';

        } else if (error.status === 403) {

          this.errorMessage =
            'Your account is inactive';

        } else if (error.status === 0) {

          this.errorMessage =
            'Unable to connect to authentication service';

        } else {

          this.errorMessage =
            'Login failed. Please try again.';
        }

        // Force Angular to update the UI
        this.cdr.detectChanges();
      }

    });
  }


  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}



// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';


// import { AuthService } from '../../services/auth';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [FormsModule],
//   templateUrl: './login.html',
//   styleUrl: './login.css'
// })
// export class Login {

//   username = '';
//   password = '';

//   constructor(private authService: AuthService, private router: Router) {}

//   login(): void {

//     console.log('Calling login API...');

//     this.authService.login(
//       this.username,
//       this.password
//     ).subscribe({


//       next: (response) => {

//         console.log('Login successful!');
//         console.log('Response:', response);

//         this.authService.saveSession(response);

//         console.log('JWT stored successfully');
//         console.log('User stored:', response.user);
        
//         this.router.navigate(['/products']);


//       },

//       error: (error) => {

//         console.error('Login failed:', error);

//       }

//     });
//   }

//   goToRegister(): void {
//     this.router.navigate(['/register']);
//   }
// }