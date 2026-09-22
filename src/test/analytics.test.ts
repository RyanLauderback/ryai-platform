import { aggregateUsage, bucketWeekly } from "@/lib/analytics";
import type { UsageDay } from "@/types";

const days: UsageDay[] = Array.from({ length: 10 }, (_, index) => ({
  date: `2024-12-${String(index + 1).padStart(2, "0")}`,
  queries: index + 1,
  documents: 2,
  tokens: 100,
  activeUsers: 5,
}));

describe("analytics transforms", () => {
  it("aggregates the selected trailing range", () => {
    const result = aggregateUsage(days, 3);
    expect(result.selected).toHaveLength(3);
    expect(result.queries).toBe(27);
    expect(result.documents).toBe(6);
    expect(result.tokens).toBe(300);
    expect(result.averageUsers).toBe(5);
  });

  it("buckets usage into weekly chart points", () => {
    const result = bucketWeekly(days);
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ queries: 28, documents: 14 });
    expect(result[1]).toMatchObject({ queries: 27, documents: 6 });
  });
});
