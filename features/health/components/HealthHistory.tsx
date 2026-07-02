"use client";

import Card from "@/components/ui/Card";
import { useFamily } from "@/providers/FamilyProvider";

export default function HealthHistory() {
  const { family } = useFamily();

  const events = (family.events ?? [])
    .filter((event) => event.type === "health")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  return (
    <Card>
      <h2 className="text-xl font-semibold text-[#2F2F2F]">
        Historique santé
      </h2>

      <div className="mt-4 space-y-4">
        {events.length === 0 ? (
          <p className="text-[#6B6B6B]">Aucun événement santé.</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="border-b border-gray-100 pb-4">
              <p className="font-semibold">{event.title}</p>

              <p className="mt-1 whitespace-pre-line text-sm text-[#6B6B6B]">
                {event.description}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                {new Date(event.createdAt).toLocaleString("fr-FR")}
              </p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}