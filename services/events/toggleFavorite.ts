import { Family } from "@/types/Family";

export function toggleFavorite(
  family: Family,
  eventId: string
): Family {
  return {
    ...family,
    events: family.events.map((event) =>
      event.id === eventId
        ? {
            ...event,
            favorite: !event.favorite,
          }
        : event
    ),
  };
}