export type ProductCategory = 'lanches' | 'batatas' | 'sucos' | 'refrigerantes' | 'chocolates';

export interface ProductAddon {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  image: string;
  tag?: string;
  prepTimeMin: number;
  availableAddons?: ProductAddon[];
}

export interface SelectedAddon {
  id: string;
  name: string;
  price: number;
}

export interface OrderItem {
  id: string; // unique order item id (includes addon signature)
  productId: string;
  name: string;
  category: ProductCategory;
  unitPrice: number;
  quantity: number;
  selectedAddons: SelectedAddon[];
  notes?: string;
  totalPrice: number;
  image: string;
}

export type OrderType = 'comer_aqui' | 'levar';

export type PaymentMethod = 'pix' | 'cartao_credito' | 'cartao_debito' | 'vale_refeicao';

export type OrderStatus = 'recebido' | 'preparando' | 'pronto' | 'entregue';

export interface Order {
  id: string;
  orderNumber: string; // e.g. "042"
  customerName: string;
  orderType: OrderType;
  items: OrderItem[];
  subtotal: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  estimatedTimeMin: number;
}
