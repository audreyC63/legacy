"use client";

import { useState } from "react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import { useFamily } from "@/providers/FamilyProvider";
import { addEvent } from "@/services/events";

export default function MedicationForm() {
  const { family, setFamily } = useFamily();

  const [medicine, setMedicine] = useState("");
  const [dose, setDose] = useState("");
  const [hour, setHour] = useState("");
  const [notes, setNotes] = useState("");

  function saveMedication() {
    if (!medicine) return;

    setFamily((current) =>
      addEvent(current, {
        type: "health",
        title: `💊 ${medicine}`,
        description: [
          dose && `Dose : ${dose}`,
          hour && `Administré à : ${hour}`,
          notes,
        ]
          .filter(Boolean)
          .join("\n"),
        date: new Date().toISOString(),
        images: [],
        favorite: false,
      })
    );

    setMedicine("");
    setDose("");
    setHour("");
    setNotes("");
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold">
        Médicament
      </h2>

      <div className="mt-5 space-y-4">
        <Input
          placeholder="Nom du médicament"
          value={medicine}
          onChange={setMedicine}
        />

        <Input
          placeholder="Dose (5 ml)"
          value={dose}
          onChange={setDose}
        />

        <Input
          type="time"
          value={hour}
          onChange={setHour}
        />

        <textarea
          className="min-h-28 w-full rounded-xl border border-gray-300 p-4"
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <Button onClick={saveMedication}>
          Enregistrer le médicament
        </Button>
      </div>
    </Card>
  );
}