"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

import { useFamily } from "@/providers/FamilyProvider";
import { addEvent, updateEvent } from "@/services/events";
import { LegacyEvent } from "@/types/Event";

type Props = {
  editingEvent?: LegacyEvent | null;
  onDone?: () => void;
};

export default function GrowthForm({ editingEvent, onDone }: Props) {
  const { setFamily } = useFamily();

  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [head, setHead] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  function saveGrowth() {
    if (!weight && !height && !head && !editingEvent) return;

    const description = [
      weight && `Poids : ${weight} kg`,
      height && `Taille : ${height} cm`,
      head && `Périmètre crânien : ${head} cm`,
      notes,
    ]
      .filter(Boolean)
      .join("\n");

    if (editingEvent) {
      setFamily((current) =>
        updateEvent(current, editingEvent.id, {
          title: "📈 Nouvelle mesure",
          description,
          date: date || editingEvent.date,
        })
      );

      onDone?.();
      return;
    }

    setFamily((current) =>
      addEvent(current, {
        type: "growth",
        title: "📈 Nouvelle mesure",
        description,
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
      <h2 className="text-xl font-semibold text-black">
        {editingEvent ? "Modifier la mesure" : "Nouvelle mesure"}
      </h2>

      <div className="mt-5 space-y-4">
        <Input placeholder="Poids (kg)" value={weight} onChange={setWeight} />
        <Input placeholder="Taille (cm)" value={height} onChange={setHeight} />
        <Input placeholder="Périmètre crânien (cm)" value={head} onChange={setHead} />
        <Input type="date" value={date} onChange={setDate} />

        <Textarea value={notes} onChange={setNotes} placeholder="Notes" />

        <Button onClick={saveGrowth}>
          {editingEvent ? "Mettre à jour" : "Enregistrer la mesure"}
        </Button>
      </div>
    </Card>
  );
}