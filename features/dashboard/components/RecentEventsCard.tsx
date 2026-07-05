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
        <h2 className="text-xl font-semibold">
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
            <div key={event.id}>
              <p className="font-semibold">
                {event.title}
              </p>

              <p className="text-sm text-black">
                {event.description}
              </p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}