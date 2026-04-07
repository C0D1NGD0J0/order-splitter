export interface AppConfig {
  quantityDecimalPlaces: number;
  defaultStockPrice: number;
  marketOpenHour: number;
  marketOpenMinute: number;
  marketCloseHour: number;
  port: number;
}

function parseEnvInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined) return fallback;
  const value = parseInt(raw, 10);
  if (isNaN(value))
    throw new Error(`Invalid env var ${name}: "${raw}" is not a number`);
  return value;
}

function parseEnvFloat(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined) return fallback;
  const value = parseFloat(raw);
  if (isNaN(value))
    throw new Error(`Invalid env var ${name}: "${raw}" is not a number`);
  return value;
}

const config: AppConfig = {
  quantityDecimalPlaces: parseEnvInt("QUANTITY_DECIMAL_PLACES", 3),
  defaultStockPrice: parseEnvFloat("DEFAULT_STOCK_PRICE", 100),
  marketOpenHour: parseEnvInt("MARKET_OPEN_HOUR", 14),
  marketOpenMinute: parseEnvInt("MARKET_OPEN_MINUTE", 30),
  marketCloseHour: parseEnvInt("MARKET_CLOSE_HOUR", 21),
  port: parseEnvInt("PORT", 5005),
};

export default config;
