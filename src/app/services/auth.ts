import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  role: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8001/api/auth';

  private userSubject = new BehaviorSubject<User | null>(
    this.getStoredUser()
  );

  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(
    username: string,
    email: string,
    password: string
  ): Observable<any> {

    const registerData: RegisterRequest = {
      username,
      email,
      password
    };

    return this.http.post(
      `${this.apiUrl}/register`,
      registerData
    );
  }


  login(
    username: string,
    password: string
  ): Observable<LoginResponse> {

    const loginData: LoginRequest = {
      username,
      password
    };

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      loginData
    );
  }

  saveSession(response: LoginResponse): void {

    localStorage.setItem(
      'access_token',
      response.access_token
    );

    localStorage.setItem(
      'user',
      JSON.stringify(response.user)
    );

    this.userSubject.next(response.user);
  }

  logout(): void {

    localStorage.removeItem('access_token');
    localStorage.removeItem('user');

    this.userSubject.next(null);
  }

  getUser(): User | null {
    return this.userSubject.value;
  }

  isAdmin(): boolean {
    return this.userSubject.value?.role === 'ADMIN';
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  private getStoredUser(): User | null {

    const user = localStorage.getItem('user');

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }
}