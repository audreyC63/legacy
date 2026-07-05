import { LegacyEvent } from "@/types/Event";
import TimelineItem from "./TimelineItem";

type Props = {
  events: LegacyEvent[];
};

export default function TimelineList({ events }: Props) {
  const sorted = [...events].sort(
    (a, b) =>
      new Date(b.date).getTime() -
      new Date(a.date).getTime()
  );

  if (sorted.length === 0) {
    return (
      <p className="text-center text-black">
        Aucun événement.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {sorted.map((event) => (
        <TimelineItem
          key={event.id}
          event={event}
        />
      ))}
    </div>
  );
}