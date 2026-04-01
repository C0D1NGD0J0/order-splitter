import { Order } from "../interfaces/index";

class OrderStore {
  private orders: Map<string, Order> = new Map();

  save(order: Order): Order {
    this.orders.set(order.id, order);
    return order;
  }

  findById(id: string): Order | undefined {
    return this.orders.get(id);
  }

  findAll(): Order[] {
    return Array.from(this.orders.values()).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  clear(): void {
    this.orders.clear();
  }
}

export const orderStore = new OrderStore();
