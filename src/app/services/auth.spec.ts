import { environment } from '../../environments/environment';
import { TestBed } from '@angular/core/testing';
import {
  provideHttpClient,
} from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';

import {
  AuthService,
  LoginResponse,
} from './auth';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login', () => {
    const mockResponse: LoginResponse = {
      access_token: 'test-token',
      token_type: 'bearer',
      user: {
        id: 1,
        username: 'customer1',
        role: 'CUSTOMER',
      },
    };

    service
      .login('customer1', 'password123')
      .subscribe((response) => {
        expect(response.access_token).toBe('test-token');
        expect(response.user.username).toBe('customer1');
      });

    const req = httpMock.expectOne(
      // 'http://localhost:8001/api/auth/login'
      `${environment.apiUrl}/api/auth/login`
    );

    expect(req.request.method).toBe('POST');

    expect(req.request.body).toEqual({
      username: 'customer1',
      password: 'password123',
    });

    req.flush(mockResponse);
  });

  it('should register customer', () => {
    service
      .register(
        'customer1',
        'customer@test.com',
        'password123'
      )
      .subscribe((response) => {
        expect(response.message).toBe(
          'User registered successfully'
        );
      });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/api/auth/register`
    );

    expect(req.request.method).toBe('POST');

    expect(req.request.body).toEqual({
      username: 'customer1',
      email: 'customer@test.com',
      password: 'password123',
    });

    req.flush({
      message: 'User registered successfully',
    });
  });

  it('should save login session', () => {
    const response: LoginResponse = {
      access_token: 'abc123',
      token_type: 'bearer',
      user: {
        id: 1,
        username: 'admin',
        role: 'ADMIN',
      },
    };

    service.saveSession(response);

    expect(
      localStorage.getItem('access_token')
    ).toBe('abc123');

    expect(service.getUser()?.username).toBe('admin');

    expect(service.isLoggedIn()).toBe(true);
    expect(service.isAdmin()).toBe(true);
  });

  it('should logout', () => {
    const response: LoginResponse = {
      access_token: 'abc123',
      token_type: 'bearer',
      user: {
        id: 1,
        username: 'customer1',
        role: 'CUSTOMER',
      },
    };

    service.saveSession(response);

    service.logout();

    expect(
      localStorage.getItem('access_token')
    ).toBeNull();

    expect(
      localStorage.getItem('user')
    ).toBeNull();

    expect(service.getUser()).toBeNull();
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should identify admin user', () => {
    service.saveSession({
      access_token: 'admin-token',
      token_type: 'bearer',
      user: {
        id: 1,
        username: 'admin',
        role: 'ADMIN',
      },
    });

    expect(service.isAdmin()).toBe(true);
  });

  it('should identify customer as non-admin', () => {
    service.saveSession({
      access_token: 'customer-token',
      token_type: 'bearer',
      user: {
        id: 2,
        username: 'customer1',
        role: 'CUSTOMER',
      },
    });

    expect(service.isAdmin()).toBe(false);
  });
});