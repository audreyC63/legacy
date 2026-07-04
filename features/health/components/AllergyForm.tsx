"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

import { useFamily } from "@/providers/FamilyProvider";
import { addEvent } from "@/services/events";

export default function AllergyForm() {
  const { setFamily } = useFamily();

  const [allergen, setAllergen] = useState("");
  const [severity, setSeverity] = useState("");
  const [reaction, setReaction] = useState("");
  const [notes, setNotes] = useState("");

  function saveAllergy() {
    if (!allergen.trim()) return;

    setFamily((current) =>
      addEvent(current, {
        type: "health",
        title: `🤧 Allergie : ${allergen}`,
        description: [
          severity && `Gravité : ${severity}`,
          reaction && `Réaction : ${reaction}`,
          notes,
        ]
          .filter(Boolean)
          .join("\n"),
        date: new Date().toISOString(),
        images: [],
        favorite: false,
      })
    );

    setAllergen("");
    setSeverity("");
    setReaction("");
    setNotes("");
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold">
        Allergie
      </h2>

      <div className="mt-5 space-y-4">
        <Input
          placeholder="Allergène"
          value={allergen}
          onChange={setAllergen}
        />

        <Input
          placeholder="Gravité"
          value={severity}
          onChange={setSeverity}
        />

        <Input
          placeholder="Réaction"
          value={reaction}
          onChange={setReaction}
        />

        <textarea
          className="min-h-28 w-full rounded-xl border border-gray-300 p-4"
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <Button onClick={saveAllergy}>
          Enregistrer l'allergie
        </Button>
      </div>
    </Card>
  );
}