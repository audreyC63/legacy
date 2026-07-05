import { Family } from "@/types/Family";
import { LegacyEvent } from "@/types/Event";

export function updateEvent(
  family: Family,
  eventId: string,
  updates: Partial<LegacyEvent>
): Family {
  return {
    ...family,
    events: family.events.map((event) =>
      event.id === eventId ? { ...event, ...updates } : event
    ),
  };
}