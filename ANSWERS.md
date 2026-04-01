# ANSWERS

## What was your approach?
I divided the problem into three parts: order splitting (core math), execution scheduling (market hours), and order history (persistence + retrieval).

- Validation at the boundary using Zod, business logic in services, thin route handlers
- `app.ts` and `server.ts` are separated so tests can import the Express app without starting a real server
- `server.ts` uses a singleton `Server` class with `start()`, `shutdown()`, and process signal handlers for clean lifecycle management
- Six focused tests covering the most critical behaviors — additional validations (negative amounts, duplicate symbols, invalid type) are enforced by Zod at the boundary and don't need separate test cases

## What assumptions did you make?
- Allocations are percentages (0–100) summing to 100%, with a 0.01 tolerance for floating-point rounding
- Share quantities are floored, not rounded — rounding up risks exceeding the intended investment
- Market hours: Mon–Fri, 14:00–21:00 UTC (approx. US Eastern 9:30–4pm). No holiday calendar
- Stock symbols are normalized to uppercase
- "Historic orders" = all orders in the current session (in-memory, no persistence)
- `executionTime` is either now (if markets are open) or the next market open

## What challenges did you face?
- **Scheduling ambiguity**: the spec says "when to execute" but doesn't define the rules. I went with simplified UTC market hours — good enough for a POC, but a production system would need a full holiday calendar and per-exchange hours.
- **Decimal places config**: "internally configurable" is vague. Environment variables are the standard approach — no code changes needed, works naturally with containers.
- **Price override**: made `price` optional per allocation so partners can override selectively rather than all-or-nothing.

## Production considerations
- Auth: API keys or OAuth2 per partner, rate limiting
- Persistence: replace in-memory store with PostgreSQL, add indexing on `type`, `symbol`, `createdAt`
- Reliability: structured logging with correlation IDs, idempotency keys on order creation, circuit breaker for external price APIs
- Ops: CI/CD, Docker, APM, API versioning (`/api/v1/...`)
- Business logic: real market data provider, order status lifecycle (PENDING → SCHEDULED → EXECUTED → SETTLED), audit logging

## LLM usage
Used Claude to discuss and plan my architecture desig, and drafting documentation. The `Server` singleton pattern was modelled after a production Node.js codebase I am currently building. Design decisions, tradeoffs, and code, and code-review are mine.
