import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import config from "../config";

dayjs.extend(utc);

/**
 * Determines the next valid market execution time.
 *
 * Markets are open Monday–Friday during configured hours.
 * - If currently within market hours on a weekday → execute now.
 * - If before market open on a weekday → schedule for today's open.
 * - If after market close on a weekday or on a weekend → schedule for
 *   the next weekday's market open.
 */
export function getNextExecutionTime(now: Date = new Date()): Date {
  const current = dayjs.utc(now);
  const day = current.day(); // 0 = Sunday, 6 = Saturday
  const hour = current.hour();

  const isWeekday = day >= 1 && day <= 5;
  const isDuringMarketHours =
    hour >= config.marketOpenHour && hour < config.marketCloseHour;

  // if weekday + market is open = execute immediately
  if (isWeekday && isDuringMarketHours) {
    return now;
  }

  // if weekday + before market open = schedule for today's open
  if (isWeekday && hour < config.marketOpenHour) {
    return current
      .hour(config.marketOpenHour)
      .minute(0)
      .second(0)
      .millisecond(0)
      .toDate();
  }

  // if after market close on a weekday, or weekend → advance to next weekday
  let next = current
    .add(1, "day")
    .hour(config.marketOpenHour)
    .minute(0)
    .second(0)
    .millisecond(0);

  while (next.day() === 0 || next.day() === 6) {
    next = next.add(1, "day");
  }

  return next.toDate();
}
