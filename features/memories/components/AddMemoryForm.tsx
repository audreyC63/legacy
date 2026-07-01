"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { useFamily } from "@/providers/FamilyProvider";
import { addEvent } from "@/services/events";

export default function AddMemoryForm() {
  const { family, setFamily } = useFamily();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function handleSave() {
    if (!title.trim()) return;

    setFamily(
      addEvent(family, {
        type: "memory",
        title,
        description,
        date: new Date().toISOString(),
        images: [],
        favorite: false,
      })
    );

    setTitle("");
    setDescription("");
  }

  const memories = (family.events ?? []).filter(
    (event) => event.type === "memory"
  );

  return (
    <>
      <Card>
        <h2 className="text-2xl font-semibold text-[#2F2F2F]">
          Ajouter un souvenir
        </h2>

        <div className="mt-6 space-y-4">
          <Input value={title} onChange={setTitle} placeholder="Titre" />

          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Racontez ce moment..."
            className="min-h-32 w-full rounded-2xl border border-gray-300 bg-white p-4 outline-none transition focus:border-[#7C9A7A]"
          />
        </div>

        <div className="mt-6">
          <Button onClick={handleSave}>Enregistrer</Button>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-[#2F2F2F]">
          Souvenirs enregistrés
        </h2>

        <div className="mt-4 space-y-4">
          {memories.length === 0 ? (
            <p className="text-[#6B6B6B]">Aucun souvenir pour le moment.</p>
          ) : (
            memories.map((memory) => (
              <div key={memory.id} className="border-b border-gray-100 pb-4">
                <p className="font-semibold text-[#2F2F2F]">{memory.title}</p>
                <p className="mt-1 text-sm text-[#6B6B6B]">
                  {memory.description}
                </p>
              </div>
            ))
          )}
        </div>
      </Card>
    </>
  );
}