"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

import { useFamily } from "@/providers/FamilyProvider";
import { addEvent } from "@/services/events";

export default function MedicationForm() {
  const { setFamily } = useFamily();

  const [medicine, setMedicine] = useState("");
  const [dose, setDose] = useState("");
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");
  const [notes, setNotes] = useState("");

  function saveMedication() {
    if (!medicine.trim()) return;

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
        date: date || new Date().toISOString(),
        images: [],
        favorite: false,
      })
    );

    setMedicine("");
    setDose("");
    setDate("");
    setHour("");
    setNotes("");
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold text-black">Médicament</h2>

      <div className="mt-5 space-y-4">
        <Input
          placeholder="Nom du médicament"
          value={medicine}
          onChange={setMedicine}
        />

        <Input
          placeholder="Dose (ex : 5 ml)"
          value={dose}
          onChange={setDose}
        />

        <Input type="date" value={date} onChange={setDate} />

        <Input type="time" value={hour} onChange={setHour} />

        <Textarea value={notes} onChange={setNotes} placeholder="Notes" />

        <Button onClick={saveMedication}>Enregistrer le médicament</Button>
      </div>
    </Card>
  );
}