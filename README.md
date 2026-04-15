# Robo-Advisor Order Splitter API

A RESTful API that splits investment amounts across model portfolio allocations, calculates share quantities, schedules market execution, and maintains order history.

## Quick Start

```bash
npm install
npm run dev        # Development with auto-restart (nodemon)
npm run build      # Compile TypeScript
npm start          # Run compiled JS
npm test           # Run all tests (12 total)
npm run test:coverage
```

Server starts on `http://localhost:5005`.

## Configuration

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5005` | Server port |
| `QUANTITY_DECIMAL_PLACES` | `3` | Decimal precision for share quantities |
| `DEFAULT_STOCK_PRICE` | `100` | Fallback price when partner provides none |
| `MARKET_OPEN_HOUR` | `14` | Market open hour in UTC |
| `MARKET_OPEN_MINUTE` | `30` | Market open minute in UTC (14:30 = 9:30am ET) |
| `MARKET_CLOSE_HOUR` | `21` | Market close hour in UTC (21:00 = 4:00pm ET) |

## API Endpoints

### `POST /api/orders` — Create Order

Splits an investment across a model portfolio and schedules execution.

### `GET /api/orders` — Order History

Returns all orders, newest first. Optional query filters:

```
GET /api/orders
GET /api/orders?type=BUY
GET /api/orders?type=SELL
GET /api/orders?symbol=AAPL
GET /api/orders?portfolioName=Tech
```

Returns `400` for an invalid `type` value.

### `GET /api/orders/:id` — Single Order

Returns `404` if the order does not exist.

### `GET /health` — Health Check

## Project Structure

```
app.ts                        # Express app class (separated for testability)
server.ts                     # Entry point, Server singleton with graceful shutdown
src/
├── config/index.ts           # Centralized config with env var validation
├── interfaces/index.ts       # TypeScript interfaces
├── middleware/responseTime.ts # Response time logging
├── routes/orderRoutes.ts     # REST route handlers
├── services/orderService.ts  # Core order splitting logic (uses decimal.js)
├── store/orderStore.ts       # In-memory data store
├── utils/scheduling.ts       # Market hours scheduling
└── validation/schemas.ts     # Zod request validation
tests/
├── orders.test.ts            # API integration tests (6 tests)
└── scheduling.test.ts        # Scheduling unit tests (6 tests)
```

## Dependencies

| Package | Purpose |
|---|---|
| `express` | HTTP framework |
| `zod` | Runtime request validation |
| `decimal.js` | Precise financial arithmetic |
| `dayjs` | UTC-aware date/time for scheduling |
| `uuid` | Unique order ID generation |
| `jest` + `ts-jest` + `supertest` | Testing |
