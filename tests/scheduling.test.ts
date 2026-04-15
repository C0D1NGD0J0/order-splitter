import { getNextExecutionTime } from "../src/utils/scheduling";

function utcDate(isoString: string): Date {
  return new Date(isoString);
}

describe("getNextExecutionTime", () => {
  it("returns current time when markets are open", () => {
    const now = utcDate("2024-01-15T15:00:00Z"); // Monday 3pm UTC
    expect(getNextExecutionTime(now)).toEqual(now);
  });

  it("schedules for today's open when before market hours on a weekday", () => {
    const now = utcDate("2024-01-15T10:00:00Z"); // Monday 10am UTC
    expect(getNextExecutionTime(now)).toEqual(utcDate("2024-01-15T14:30:00Z"));
  });

  it("schedules for next day when after market close on a weekday", () => {
    const now = utcDate("2024-01-15T22:00:00Z"); // Monday 10pm UTC
    expect(getNextExecutionTime(now)).toEqual(utcDate("2024-01-16T14:30:00Z")); // Tuesday
  });

  it("skips to Monday when placed on Friday after close", () => {
    const now = utcDate("2024-01-19T22:00:00Z"); // Friday 10pm UTC
    expect(getNextExecutionTime(now)).toEqual(utcDate("2024-01-22T14:30:00Z")); // Monday
  });

  it("skips to Monday when placed on Saturday", () => {
    const now = utcDate("2024-01-20T15:00:00Z"); // Saturday
    expect(getNextExecutionTime(now)).toEqual(utcDate("2024-01-22T14:30:00Z")); // Monday
  });

  it("does not execute at 14:29 UTC — one minute before open", () => {
    const now = utcDate("2024-01-15T14:29:00Z"); // Monday, 1 min before open
    expect(getNextExecutionTime(now)).toEqual(utcDate("2024-01-15T14:30:00Z"));
  });
});
