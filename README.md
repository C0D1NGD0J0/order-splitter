# Robo-Advisor Order Splitter API

A RESTful API that splits investment amounts across model portfolio allocations, calculates share quantities, schedules market execution, and maintains order history.

## Quick Start

```bash
npm install
npm run dev        # Development with ts-node
npm run build      # Compile TypeScript
npm start          # Run compiled JS
npm test           # Run tests
npm run test:coverage
```

Server starts on `http://localhost:3000`.

## Configuration

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Server port |
| `QUANTITY_DECIMAL_PLACES` | `3` | Max decimal places for share quantities |
| `DEFAULT_STOCK_PRICE` | `100` | Default price when no override provided |

```bash
QUANTITY_DECIMAL_PLACES=7 npm run dev
```

## API Endpoints

### `POST /api/orders` — Create Order

Splits an investment across a model portfolio and schedules execution.

### `GET /api/orders` — Order History

Returns all orders, newest first. Optional query filters:

```
GET /api/orders
GET /api/orders?type=BUY
GET /api/orders?symbol=AAPL
GET /api/orders?portfolioName=Tech
```

### `GET /api/orders/:id` — Single Order

### `GET /health` — Health Check

# All orders
curl http://localhost:3000/api/orders

# Single order
curl http://localhost:3000/api/orders/<order-id>

## Project Structure

```
src/
├── app.ts                    # Express app (separated for testability)
├── server.ts                 # Entry point
├── config/index.ts           # Centralized config
├── middleware/responseTime.ts # Response time logging
├── models/types.ts           # TypeScript interfaces
├── routes/orderRoutes.ts     # REST route handlers
├── services/orderService.ts  # Core splitting logic
├── store/orderStore.ts       # In-memory data store
├── utils/scheduling.ts       # Market hours scheduling
└── validation/schemas.ts     # Zod request validation
tests/
├── orders.test.ts            # API integration tests (17 tests)
└── scheduling.test.ts        # Scheduling unit tests (6 tests)
```

## Dependencies

| Package | Purpose |
|---|---|
| `express` | HTTP framework |
| `zod` | Runtime request validation with TypeScript type inference |
| `uuid` | Unique order ID generation |
| `jest` + `ts-jest` + `supertest` | Testing |
