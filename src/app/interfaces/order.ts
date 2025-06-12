export interface Order {
  id: string;
  customerId: string;
  orderDate: string;
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  products: {
    productId: string;
    quantity: number;
    priceAtOrder: number; 
  }[];
}
