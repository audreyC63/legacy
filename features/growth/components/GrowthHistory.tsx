"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { deleteEvent } from "@/services/events";
import { LegacyEvent } from "@/types/Event";
import { useFamily } from "@/providers/FamilyProvider";

type Props = {
  onEdit: (event: LegacyEvent) => void;
};

export default function GrowthHistory({ onEdit }: Props) {
  const { family, setFamily } = useFamily();

  const events = (family.events ?? [])
    .filter((event) => event.type === "growth")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <Card>
      <h2 className="text-xl font-semibold text-black">Historique des mesures</h2>

      <div className="mt-5 space-y-4">
        {events.length === 0 ? (
          <p className="text-black">Aucune mesure enregistrée.</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="border-b border-gray-100 pb-4">
              <p className="font-semibold text-black">{event.title}</p>

              <p className="mt-1 whitespace-pre-line text-sm text-black">
                {event.description}
              </p>

              <p className="mt-2 text-xs text-gray-700">
                {new Date(event.date).toLocaleDateString("fr-FR")}
              </p>

              <div className="mt-3 space-y-2">
                <Button onClick={() => onEdit(event)}>Modifier</Button>

                <Button
                  onClick={() =>
                    setFamily((current) => deleteEvent(current, event.id))
                  }
                >
                  Supprimer
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}