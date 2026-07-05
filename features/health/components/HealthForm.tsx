"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

import { useFamily } from "@/providers/FamilyProvider";
import { addEvent } from "@/services/events";

function toIsoDate(date: string, time: string) {
  const [day, month, year] = date.split("/");

  if (!day || !month || !year) {
    return new Date().toISOString();
  }

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${
    time || "00:00"
  }:00`;
}

export default function HealthForm() {
  const { family, setFamily } = useFamily();

  const [temperature, setTemperature] = useState("");
  const [medicine, setMedicine] = useState("");
  const [dose, setDose] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  function handleSave() {
    if (!temperature.trim() && !medicine.trim()) return;

    const title = temperature
      ? `🌡️ Température : ${temperature}°C`
      : `💊 Médicament : ${medicine}`;

    const description = [
      medicine && `Médicament : ${medicine}`,
      dose && `Dose : ${dose}`,
      time && `Heure : ${time}`,
      notes,
    ]
      .filter(Boolean)
      .join("\n");

    setFamily(
      addEvent(family, {
        type: "health",
        title,
        description,
        date: date ? toIsoDate(date, time) : new Date().toISOString(),
        images: [],
        favorite: false,
      })
    );

    setTemperature("");
    setMedicine("");
    setDose("");
    setDate("");
    setTime("");
    setNotes("");
  }

  return (
    <Card>
      <h2 className="text-2xl font-bold text-black">
        Ajouter un suivi santé
      </h2>

      <div className="mt-6 space-y-5">
        <Input value={temperature} onChange={setTemperature} placeholder="Température (ex : 38.7)" />
        <Input value={medicine} onChange={setMedicine} placeholder="Médicament" />
        <Input value={dose} onChange={setDose} placeholder="Dose (ex : 5 ml)" />

        <Input
          value={date}
          onChange={setDate}
          placeholder="Date (JJ/MM/AAAA)"
        />

        <Input
          value={time}
          onChange={setTime}
          placeholder="Heure (ex : 14:30)"
        />

        <Textarea
          value={notes}
          onChange={setNotes}
          placeholder="Notes, symptômes, évolution..."
        />

        <Button onClick={handleSave}>Enregistrer</Button>
      </div>
    </Card>
  );
}