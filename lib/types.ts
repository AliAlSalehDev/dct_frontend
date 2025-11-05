export type StockStatus = "in_stock" | "out_of_stock";

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  stockStatus: StockStatus;
  category?: Category;
  createdAt?: string;
}

export interface ApiPage<T> {
  data: T[];
  meta?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}
