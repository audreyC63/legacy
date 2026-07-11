"use client";

import { useEffect, useState } from "react";

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

function toIsoDate(date: string) {
  const [day, month, year] = date.split("/");

  if (!day || !month || !year) {
    return new Date().toISOString();
  }

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T00:00:00`;
}

function toDisplayDate(date: string) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("fr-FR");
}

function extractValue(description: string, label: string) {
  const line = description
    .split("\n")
    .find((item) => item.startsWith(label));

  if (!line) return "";

  return line.replace(label, "").trim().split(" ")[0];
}

export default function GrowthForm({
  editingEvent,
  onDone,
}: Props) {
  const { setFamily } = useFamily();

  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [head, setHead] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!editingEvent) return;

    setWeight(
      extractValue(editingEvent.description, "Poids :")
    );

    setHeight(
      extractValue(editingEvent.description, "Taille :")
    );

    setHead(
      extractValue(
        editingEvent.description,
        "Périmètre crânien :"
      )
    );

    setDate(toDisplayDate(editingEvent.date));

    const noteLines = editingEvent.description
      .split("\n")
      .filter(
        (line) =>
          !line.startsWith("Poids :") &&
          !line.startsWith("Taille :") &&
          !line.startsWith("Périmètre crânien :")
      );

    setNotes(noteLines.join("\n"));
  }, [editingEvent]);

  function resetForm() {
    setWeight("");
    setHeight("");
    setHead("");
    setDate("");
    setNotes("");
  }

  function saveGrowth() {
    if (!weight && !height && !head) return;

    const description = [
      weight && `Poids : ${weight} kg`,
      height && `Taille : ${height} cm`,
      head && `Périmètre crânien : ${head} cm`,
      notes,
    ]
      .filter(Boolean)
      .join("\n");

    const eventDate = date
      ? toIsoDate(date)
      : editingEvent?.date ?? new Date().toISOString();

    if (editingEvent) {
      setFamily((current) =>
        updateEvent(current, editingEvent.id, {
          title: "📈 Nouvelle mesure",
          description,
          date: eventDate,
        })
      );

      resetForm();
      onDone?.();
      return;
    }

    setFamily((current) =>
      addEvent(current, {
        type: "growth",
        title: "📈 Nouvelle mesure",
        description,
        date: eventDate,
        images: [],
        favorite: false,
      })
    );

    resetForm();
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold text-black">
        {editingEvent
          ? "Modifier la mesure"
          : "Nouvelle mesure"}
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
          placeholder="Date (JJ/MM/AAAA)"
          value={date}
          onChange={setDate}
        />

        <Textarea
          value={notes}
          onChange={setNotes}
          placeholder="Notes"
        />

        <Button onClick={saveGrowth}>
          {editingEvent
            ? "Mettre à jour"
            : "Enregistrer la mesure"}
        </Button>
      </div>
    </Card>
  );
}