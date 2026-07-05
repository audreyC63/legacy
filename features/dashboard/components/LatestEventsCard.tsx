"use client";

import Link from "next/link";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useFamily } from "@/providers/FamilyProvider";

export default function LatestEventsCard() {
  const { family } = useFamily();

  const events = [...(family.events ?? [])]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-black">
          Derniers événements
        </h2>

        <Link href="/timeline">
          <Button>Voir tout</Button>
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        {events.length === 0 ? (
          <p className="text-black">Aucun événement.</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="border-b border-gray-100 pb-3">
              <p className="font-semibold text-black">{event.title}</p>
              <p className="mt-1 text-sm text-black">
                {new Date(event.date).toLocaleDateString("fr-FR")}
              </p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}