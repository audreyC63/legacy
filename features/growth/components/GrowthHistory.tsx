"use client";

import Card from "@/components/ui/Card";
import { useFamily } from "@/providers/FamilyProvider";

export default function GrowthHistory() {
  const { family } = useFamily();

  const events = (family.events ?? [])
    .filter((event) => event.type === "growth")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );

  return (
    <Card>
      <h2 className="text-xl font-semibold">
        Historique des mesures
      </h2>

      <div className="mt-5 space-y-4">
        {events.length === 0 ? (
          <p className="text-black">
            Aucune mesure enregistrée.
          </p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="border-b border-gray-100 pb-4"
            >
              <p className="font-semibold">
                {event.title}
              </p>

              <p className="mt-1 whitespace-pre-line text-sm text-black">
                {event.description}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                {new Date(event.date).toLocaleDateString("fr-FR")}
              </p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}