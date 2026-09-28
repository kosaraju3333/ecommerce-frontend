import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { convertToParamMap } from '@angular/router';

import { EditProduct } from './edit-product';
import { ProductService } from '../../services/product';
import { Product } from '../../models/product';

describe('EditProduct', () => {

  let component: EditProduct;
  let fixture: ComponentFixture<EditProduct>;

  const mockProduct: Product = {
    id: 1,
    name: 'iPhone 17',
    description: 'Apple smartphone',
    price: 79999,
    sku: 'IPHONE17-001',
    category: 'Smartphones',
    image_url: '/images/iphone-17.jpg',
    rating: 4.5,
    stock_quantity: 25,
    is_active: true
  };

  const mockProductService = {
    getProduct: vi.fn().mockReturnValue(
      of(mockProduct)
    ),

    updateProduct: vi.fn().mockReturnValue(
      of(mockProduct)
    )
  };

  const mockRouter = {
    navigate: vi.fn()
  };

  beforeEach(async () => {

    await TestBed.configureTestingModule({

      imports: [
        EditProduct
      ],

      providers: [

        {
          provide: ProductService,
          useValue: mockProductService
        },

        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({
                id: '1'
              })
            }
          }
        },

        {
          provide: Router,
          useValue: mockRouter
        }

      ]

    }).compileComponents();

    fixture = TestBed.createComponent(EditProduct);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });


  it('should create', () => {

    expect(component).toBeTruthy();

  });


  it('should load product using route id', () => {

    expect(
      mockProductService.getProduct
    ).toHaveBeenCalledWith(1);

    expect(component.product).toEqual(
      mockProduct
    );

  });


  it('should update product', () => {

    component.product = mockProduct;

    component.updateProduct();

    expect(
      mockProductService.updateProduct
    ).toHaveBeenCalledWith(
      1,
      mockProduct
    );

  });


  it('should navigate to products after update', () => {

    component.product = mockProduct;

    component.updateProduct();

    expect(
      mockRouter.navigate
    ).toHaveBeenCalledWith([
      '/products'
    ]);

  });

});