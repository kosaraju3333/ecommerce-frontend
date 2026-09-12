export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  sku: string;
  category: string;
  image_url: string;
  rating: number;
  stock_quantity: number;
  is_active: boolean;
}