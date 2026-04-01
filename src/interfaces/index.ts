export type OrderType = "BUY" | "SELL";

export interface StockAllocation {
  symbol: string;
  percentage: number; // 0-100
  price?: number; // optional override, defaults to config default price
}

export interface ModelPortfolio {
  name: string;
  allocations: StockAllocation[];
}

export interface OrderLineItem {
  symbol: string;
  allocationPercentage: number;
  price: number;
  amount: number;
  quantity: number;
}

export interface Order {
  id: string;
  type: OrderType;
  portfolio: ModelPortfolio;
  totalAmount: number;
  lineItems: OrderLineItem[];
  scheduledAt: string;
  createdAt: string;
}

export interface CreateOrderRequest {
  portfolio: ModelPortfolio;
  amount: number;
  type: OrderType;
}
