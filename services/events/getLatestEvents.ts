import { LegacyEvent } from "@/types/Event";

export function getLatestEvents(events: LegacyEvent[], limit = 3) {
  return [...events]
    .sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    .slice(0, limit);
}