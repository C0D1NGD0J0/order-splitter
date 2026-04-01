import { Router, Request, Response } from "express";
import { orderService } from "../services/orderService";
import { createOrderSchema } from "../validation/schemas";

const router = Router();
// In a real application I would be caling the contrller method here instead of directly
// accessing the service, but for simplicity I'm skipping the controller layer in this situation

router.post("/", (req: Request, res: Response) => {
  const result = createOrderSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      error: "Validation failed",
      details: result.error.issues.map(
        (issue: { path: (string | number)[]; message: string }) => ({
          field: issue.path.join("."),
          message: issue.message,
        }),
      ),
    });
    return;
  }

  const order = orderService.createOrder(result.data);

  res.status(201).json(order);
});

router.get("/", (req: Request, res: Response) => {
  let orders = orderService.getAllOrders();

  const { type, symbol, portfolioName } = req.query;

  if (type && typeof type === "string") {
    const upper = type.toUpperCase();
    orders = orders.filter((o) => o.type === upper);
  }

  if (symbol && typeof symbol === "string") {
    const upper = symbol.toUpperCase();
    orders = orders.filter((o) =>
      o.lineItems.some((item) => item.symbol === upper),
    );
  }

  if (portfolioName && typeof portfolioName === "string") {
    const lower = portfolioName.toLowerCase();
    orders = orders.filter((o) =>
      o.portfolio.name.toLowerCase().includes(lower),
    );
  }

  res.json(orders);
});

router.get("/:id", (req: Request, res: Response) => {
  const order = orderService.getOrderById(req.params.id as string);

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  res.json(order);
});

export default router;
