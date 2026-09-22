import type { UsageDay } from "@/types";

export function aggregateUsage(data: UsageDay[], days: number) {
  const selected = data.slice(-days);
  return {
    selected,
    queries: selected.reduce((sum, item) => sum + item.queries, 0),
    documents: selected.reduce((sum, item) => sum + item.documents, 0),
    tokens: selected.reduce((sum, item) => sum + item.tokens, 0),
    averageUsers: selected.length
      ? Math.round(selected.reduce((sum, item) => sum + item.activeUsers, 0) / selected.length)
      : 0,
  };
}

export function bucketWeekly(data: UsageDay[]) {
  const buckets: { week: string; queries: number; documents: number }[] = [];
  data.forEach((day, index) => {
    const bucketIndex = Math.floor(index / 7);
    if (!buckets[bucketIndex]) {
      buckets[bucketIndex] = { week: day.date.slice(5), queries: 0, documents: 0 };
    }
    buckets[bucketIndex].queries += day.queries;
    buckets[bucketIndex].documents += day.documents;
  });
  return buckets;
}
