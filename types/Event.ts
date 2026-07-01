export type EventType =
  | "memory"
  | "photo"
  | "growth"
  | "health"
  | "pregnancy";

export interface LegacyEvent {
  id: string;
  type: EventType;

  title: string;
  description: string;

  date: string;

  createdAt: string;

  images: string[];

  favorite: boolean;
}