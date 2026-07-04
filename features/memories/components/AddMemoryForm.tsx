"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

import { useFamily } from "@/providers/FamilyProvider";
import { addEvent, deleteEvent, toggleFavorite } from "@/services/events";

export default function AddMemoryForm() {
  const { family, setFamily } = useFamily();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  function handleSave() {
    if (!title.trim()) return;

    if (editingId) {
      setFamily((current) => ({
        ...current,
        events: current.events.map((event) =>
          event.id === editingId
            ? {
                ...event,
                title,
                description,
              }
            : event
        ),
      }));

      setEditingId(null);
    } else {
      setFamily((current) =>
        addEvent(current, {
          type: "memory",
          title,
          description,
          date: new Date().toISOString(),
          images: [],
          favorite: false,
        })
      );
    }

    setTitle("");
    setDescription("");
  }

  const memories = (family.events ?? [])
    .filter((event) => event.type === "memory")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <>
      <Card>
        <h2 className="text-2xl font-semibold">
          {editingId ? "Modifier le souvenir" : "Ajouter un souvenir"}
        </h2>

        <div className="mt-6 space-y-4">
          <Input value={title} onChange={setTitle} placeholder="Titre" />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Racontez ce moment..."
            className="min-h-32 w-full rounded-2xl border border-gray-300 p-4"
          />
        </div>

        <div className="mt-6">
          <Button onClick={handleSave}>
            {editingId ? "Mettre à jour" : "Enregistrer"}
          </Button>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold">Souvenirs enregistrés</h2>

        <div className="mt-4 space-y-4">
          {memories.length === 0 ? (
            <p>Aucun souvenir.</p>
          ) : (
            memories.map((memory) => (
              <div key={memory.id} className="border-b border-gray-100 pb-4">
                <p className="font-semibold">
                  {memory.favorite ? "⭐ " : ""}
                  {memory.title}
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  {memory.description}
                </p>

                <div className="mt-3 space-y-2">
                  <Button
                    onClick={() => {
                      setEditingId(memory.id);
                      setTitle(memory.title);
                      setDescription(memory.description);
                    }}
                  >
                    Modifier
                  </Button>

                  <Button
                    onClick={() =>
                      setFamily((current) =>
                        toggleFavorite(current, memory.id)
                      )
                    }
                  >
                    {memory.favorite
                      ? "⭐ Retirer des favoris"
                      : "☆ Ajouter aux favoris"}
                  </Button>

                  <Button
                    onClick={() =>
                      setFamily((current) => deleteEvent(current, memory.id))
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
    </>
  );
}