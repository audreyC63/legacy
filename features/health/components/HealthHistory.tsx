"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import { useFamily } from "@/providers/FamilyProvider";
import { deleteEvent, toggleFavorite } from "@/services/events";
import { LegacyEvent } from "@/types/Event";

import HealthEditForm from "./HealthEditForm";

export default function HealthHistory() {
  const { family, setFamily } = useFamily();
  const [editingEvent, setEditingEvent] = useState<LegacyEvent | null>(null);

  const events = (family.events ?? [])
    .filter((event) => event.type === "health")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (editingEvent) {
    return <HealthEditForm event={editingEvent} onDone={() => setEditingEvent(null)} />;
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold text-black">Historique santé</h2>

      <div className="mt-4 space-y-4">
        {events.length === 0 ? (
          <p className="text-black">Aucun événement santé.</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="border-b border-gray-100 pb-4">
              <p className="font-semibold text-black">
                {event.favorite ? "⭐ " : ""}
                {event.title}
              </p>

              <p className="mt-1 whitespace-pre-line text-sm text-black">
                {event.description}
              </p>

              <p className="mt-2 text-xs text-gray-700">
                {new Date(event.date).toLocaleString("fr-FR")}
              </p>

              <div className="mt-3 space-y-2">
                <Button onClick={() => setFamily((current) => toggleFavorite(current, event.id))}>
                  {event.favorite ? "⭐ Retirer des favoris" : "☆ Ajouter aux favoris"}
                </Button>

                <Button onClick={() => setEditingEvent(event)}>Modifier</Button>

                <Button onClick={() => setFamily((current) => deleteEvent(current, event.id))}>
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