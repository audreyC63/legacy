import { Family } from "@/types/Family";
import { LegacyEvent } from "@/types/Event";

export function addEvent(
  family: Family,
  event: Omit<LegacyEvent, "id" | "createdAt">
): Family {
  const newEvent: LegacyEvent = {
    ...event,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  return {
    ...family,
    events: [newEvent, ...(family.events ?? [])],
  };
}