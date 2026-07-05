import Link from "next/link";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { LegacyEvent } from "@/types/Event";
import { getLatestEvents } from "@/services/events";

type Props = {
  events: LegacyEvent[];
};

export default function RecentEventsCard({ events }: Props) {
  const latest = getLatestEvents(events, 3);

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-black">
          Derniers événements
        </h2>

        <Link href="/timeline">
          <Button>Voir tout</Button>
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        {latest.length === 0 ? (
          <p className="text-black">
            Aucun événement.
          </p>
        ) : (
          latest.map((event) => (
            <div
              key={event.id}
              className="border-b border-gray-100 pb-3 last:border-b-0"
            >
              <p className="font-semibold text-black">
                {event.title}
              </p>

              <p className="mt-1 text-sm text-black">
                {event.description}
              </p>

              <p className="mt-1 text-xs text-gray-700">
                {new Date(event.date).toLocaleDateString("fr-FR")}
              </p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}