import { getNextExecutionTime } from "../src/utils/scheduling";

function utcDate(isoString: string): Date {
  return new Date(isoString);
}

describe("getNextExecutionTime", () => {
  it("returns current time when markets are open (weekday 14:30–21:00 UTC)", () => {
    const now = utcDate("2024-01-15T15:00:00Z"); // Monday 3pm UTC
    expect(getNextExecutionTime(now)).toEqual(now);
  });

  it("schedules for today's open when before 14:30 UTC on a weekday", () => {
    const now = utcDate("2024-01-15T10:00:00Z"); // Monday 10am UTC
    const result = getNextExecutionTime(now);
    expect(result).toEqual(utcDate("2024-01-15T14:30:00Z"));
  });

  it("schedules for next weekday open when after market close on a weekday", () => {
    const now = utcDate("2024-01-15T22:00:00Z"); // Monday 10pm UTC
    const result = getNextExecutionTime(now);
    expect(result).toEqual(utcDate("2024-01-16T14:30:00Z")); // Tuesday open
  });

  it("schedules for Monday open when it is Saturday", () => {
    const now = utcDate("2024-01-13T15:00:00Z"); // Saturday
    const result = getNextExecutionTime(now);
    expect(result).toEqual(utcDate("2024-01-15T14:30:00Z")); // Monday open
  });

  it("schedules for Monday open when it is Sunday", () => {
    const now = utcDate("2024-01-14T15:00:00Z"); // Sunday
    const result = getNextExecutionTime(now);
    expect(result).toEqual(utcDate("2024-01-15T14:30:00Z")); // Monday open
  });

  it("schedules for Monday open when it is Friday after market close", () => {
    const now = utcDate("2024-01-19T21:30:00Z"); // Friday 9:30pm UTC
    const result = getNextExecutionTime(now);
    expect(result).toEqual(utcDate("2024-01-22T14:30:00Z")); // Monday open
  });
});
