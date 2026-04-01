import request from "supertest";
import { getServerInstance } from "../server";
import { orderStore } from "../src/store/orderStore";

const app = getServerInstance();

beforeEach(() => {
  orderStore.clear();
});

const validPayload = {
  portfolio: {
    name: "Tech Growth",
    allocations: [
      { symbol: "AAPL", percentage: 60 },
      { symbol: "TSLA", percentage: 40 },
    ],
  },
  amount: 100,
  type: "BUY" as const,
};

it("splits investment correctly across portfolio allocations", async () => {
  const res = await request(app).post("/api/orders").send(validPayload);

  expect(res.status).toBe(201);
  expect(res.body.lineItems).toHaveLength(2);

  const aapl = res.body.lineItems.find((i: any) => i.symbol === "AAPL");
  const tsla = res.body.lineItems.find((i: any) => i.symbol === "TSLA");

  // $100 * 60% = $60 / $100 per share = 0.6 shares
  expect(aapl.amount).toBe(60);
  expect(aapl.quantity).toBe(0.6);

  // $100 * 40% = $40 / $100 per share = 0.4 shares
  expect(tsla.amount).toBe(40);
  expect(tsla.quantity).toBe(0.4);
});

it("uses partner-provided stock prices over the default", async () => {
  const res = await request(app)
    .post("/api/orders")
    .send({
      ...validPayload,
      portfolio: {
        name: "Custom Prices",
        allocations: [
          { symbol: "AAPL", percentage: 60, price: 200 },
          { symbol: "TSLA", percentage: 40, price: 50 },
        ],
      },
      amount: 1000,
    });

  const aapl = res.body.lineItems.find((i: any) => i.symbol === "AAPL");
  const tsla = res.body.lineItems.find((i: any) => i.symbol === "TSLA");

  // $1000 * 60% = $600 / $200 = 3 shares
  expect(aapl.quantity).toBe(3);
  // $1000 * 40% = $400 / $50 = 8 shares
  expect(tsla.quantity).toBe(8);
});

it("rejects allocations that don't sum to 100%", async () => {
  const res = await request(app)
    .post("/api/orders")
    .send({
      ...validPayload,
      portfolio: {
        name: "Bad Split",
        allocations: [
          { symbol: "AAPL", percentage: 60 },
          { symbol: "TSLA", percentage: 30 },
        ],
      },
    });

  expect(res.status).toBe(400);
});

it("returns historic orders newest first", async () => {
  await request(app).post("/api/orders").send(validPayload);
  await request(app).post("/api/orders").send({ ...validPayload, type: "SELL" });

  const res = await request(app).get("/api/orders");

  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(2);
  expect(new Date(res.body[0].createdAt).getTime()).toBeGreaterThanOrEqual(
    new Date(res.body[1].createdAt).getTime(),
  );
});

it("returns a single order by ID", async () => {
  const { body: created } = await request(app).post("/api/orders").send(validPayload);

  const res = await request(app).get(`/api/orders/${created.id}`);

  expect(res.status).toBe(200);
  expect(res.body.id).toBe(created.id);
});

it("returns 404 for a non-existent order", async () => {
  const res = await request(app).get("/api/orders/does-not-exist");
  expect(res.status).toBe(404);
});
