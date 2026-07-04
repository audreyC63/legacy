import { Family } from "@/types/Family";

export function deleteEvent(
  family: Family,
  eventId: string
): Family {
  return {
    ...family,
    events: family.events.filter(
      (event) => event.id !== eventId
    ),
  };
}