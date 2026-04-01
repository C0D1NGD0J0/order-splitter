export interface AppConfig {
  quantityDecimalPlaces: number;
  defaultStockPrice: number;
  /** market open hour in UTC (e.g. 14 = 9:30am) */
  marketOpenHour: number;
  marketCloseHour: number;
  port: number;
}

const config: AppConfig = {
  quantityDecimalPlaces: parseInt(
    process.env.QUANTITY_DECIMAL_PLACES || "3",
    10,
  ),
  defaultStockPrice: parseFloat(process.env.DEFAULT_STOCK_PRICE || "100"),
  marketOpenHour: parseInt(process.env.MARKET_OPEN_HOUR || "14", 10),
  marketCloseHour: parseInt(process.env.MARKET_CLOSE_HOUR || "21", 10),
  port: parseInt(process.env.PORT || "5005", 10),
};

export default config;
