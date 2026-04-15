import Decimal from "decimal.js";
import { v4 as uuidv4 } from "uuid";
import config from "../config";
import { orderStore } from "../store/orderStore";
import { getNextExecutionTime } from "../utils/scheduling";
import { CreateOrderRequest, Order, OrderLineItem } from "../interfaces/index";

class OrderService {
  createOrder(request: CreateOrderRequest): Order {
    const { portfolio, amount, type } = request;

    // BUY: floor to never overspend. SELL: round to maximise shares sold.
    const qtyRounding = type === "BUY" ? Decimal.ROUND_DOWN : Decimal.ROUND_HALF_UP;

    const lineItems: OrderLineItem[] = portfolio.allocations.map((allocation) => {
      const price = allocation.price ?? config.defaultStockPrice;
      const allocatedAmount = new Decimal(amount).mul(allocation.percentage).div(100);
      const quantity = allocatedAmount
        .div(price)
        .toDecimalPlaces(config.quantityDecimalPlaces, qtyRounding)
        .toNumber();

      return {
        symbol: allocation.symbol,
        allocationPercentage: allocation.percentage,
        price,
        amount: allocatedAmount.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
        quantity,
      };
    });

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
