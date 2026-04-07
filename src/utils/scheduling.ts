import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import config from "../config";

dayjs.extend(utc);

/**
 * Determines the next valid market execution time.
 *
 * Markets are open Monday–Friday, 9:30am–4:00pm ET (14:30–21:00 UTC).
 * - currently within market hours on a weekday → execute now.
 * - before market open on a weekday → schedule for today's open.
 * - after market close on a weekday or on a weekend → schedule for
 *   the next weekday's market open.
 */
export function getNextExecutionTime(now: Date = new Date()): Date {
  const current = dayjs.utc(now);
  const day = current.day();

  const totalMinutes = current.hour() * 60 + current.minute();
  const openMinutes = config.marketOpenHour * 60 + config.marketOpenMinute;
  const closeMinutes = config.marketCloseHour * 60;

  const isWeekday = day >= 1 && day <= 5;
  const isDuringMarketHours =
    totalMinutes >= openMinutes && totalMinutes < closeMinutes;

  if (isWeekday && isDuringMarketHours) {
    return now;
  }

  if (isWeekday && totalMinutes < openMinutes) {
    return current
      .hour(config.marketOpenHour)
      .minute(config.marketOpenMinute)
      .second(0)
      .millisecond(0)
      .toDate();
  }
  let next = current
    .add(1, "day")
    .hour(config.marketOpenHour)
    .minute(config.marketOpenMinute)
    .second(0)
    .millisecond(0);

  while (next.day() === 0 || next.day() === 6) {
    next = next.add(1, "day");
  }

  return next.toDate();
}
