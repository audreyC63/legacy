"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

import { useFamily } from "@/providers/FamilyProvider";
import { addEvent } from "@/services/events";

export default function GrowthForm() {
  const { setFamily } = useFamily();

  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [head, setHead] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  function saveGrowth() {
    if (!weight && !height && !head) return;

    setFamily((current) =>
      addEvent(current, {
        type: "growth",
        title: "📈 Nouvelle mesure",
        description: [
          weight && `Poids : ${weight} kg`,
          height && `Taille : ${height} cm`,
          head && `Périmètre crânien : ${head} cm`,
          notes,
        ]
          .filter(Boolean)
          .join("\n"),
        date: date || new Date().toISOString(),
        images: [],
        favorite: false,
      })
    );

    setWeight("");
    setHeight("");
    setHead("");
    setDate("");
    setNotes("");
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold">
        Nouvelle mesure
      </h2>

      <div className="mt-5 space-y-4">
        <Input
          placeholder="Poids (kg)"
          value={weight}
          onChange={setWeight}
        />

        <Input
          placeholder="Taille (cm)"
          value={height}
          onChange={setHeight}
        />

        <Input
          placeholder="Périmètre crânien (cm)"
          value={head}
          onChange={setHead}
        />

        <Input
          type="date"
          value={date}
          onChange={setDate}
        />

        <textarea
          className="min-h-28 w-full rounded-xl border border-gray-300 p-4"
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <Button onClick={saveGrowth}>
          Enregistrer la mesure
        </Button>
      </div>
    </Card>
  );
}