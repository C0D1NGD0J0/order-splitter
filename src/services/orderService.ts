import { v4 as uuidv4 } from "uuid";
import config from "../config";
import { orderStore } from "../store/orderStore";
import { getNextExecutionTime } from "../utils/scheduling";
import { CreateOrderRequest, Order, OrderLineItem } from "../interfaces/index";

class OrderService {
  private static roundToDecimalPlaces(value: number, places: number): number {
    const factor = Math.pow(10, places);
    return Math.floor(value * factor) / factor;
  }

  createOrder(request: CreateOrderRequest): Order {
    const { portfolio, amount, type } = request;

    const lineItems: OrderLineItem[] = portfolio.allocations.map(
      (allocation) => {
        const price = allocation.price ?? config.defaultStockPrice;
        const allocatedAmount = amount * (allocation.percentage / 100);
        const quantity = OrderService.roundToDecimalPlaces(
          allocatedAmount / price,
          config.quantityDecimalPlaces,
        );

        return {
          symbol: allocation.symbol,
          allocationPercentage: allocation.percentage,
          price,
          amount: OrderService.roundToDecimalPlaces(allocatedAmount, 2),
          quantity,
        };
      },
    );

    const order: Order = {
      id: uuidv4(),
      type,
      portfolio,
      totalAmount: amount,
      lineItems,
      scheduledAt: getNextExecutionTime().toISOString(),
      createdAt: new Date().toISOString(),
    };

    return orderStore.save(order);
  }

  getOrderById(id: string): Order | undefined {
    return orderStore.findById(id);
  }

  getAllOrders(): Order[] {
    return orderStore.findAll();
  }
}

export const orderService = new OrderService();
