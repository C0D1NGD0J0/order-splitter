import { z } from "zod";

const stockAllocationSchema = z.object({
  symbol: z
    .string()
    .min(1, "Stock symbol is required")
    .max(10, "Stock symbol too long")
    .transform((val) => val.toUpperCase()),
  percentage: z
    .number()
    .gt(0, "Allocation percentage must be greater than 0")
    .lte(100, "Allocation percentage cannot exceed 100"),
  price: z
    .number()
    .positive("Stock price must be positive")
    .optional(),
});

const modelPortfolioSchema = z.object({
  name: z.string().min(1, "Portfolio name is required").max(100),
  allocations: z
    .array(stockAllocationSchema)
    .min(1, "Portfolio must contain at least one stock")
    .refine(
      (allocations) => {
        const total = allocations.reduce((sum, a) => sum + a.percentage, 0);
        return Math.abs(total - 100) < 0.01;
      },
      { message: "Portfolio allocations must sum to 100%" }
    )
    .refine(
      (allocations) => {
        const symbols = allocations.map((a) => a.symbol.toUpperCase());
        return new Set(symbols).size === symbols.length;
      },
      { message: "Portfolio cannot contain duplicate stock symbols" }
    ),
});

export const createOrderSchema = z.object({
  portfolio: modelPortfolioSchema,
  amount: z.number().positive("Investment amount must be positive"),
  type: z.enum(["BUY", "SELL"], {
    errorMap: () => ({ message: "Order type must be BUY or SELL" }),
  }),
});
