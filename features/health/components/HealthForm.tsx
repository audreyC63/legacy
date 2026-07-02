"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { useFamily } from "@/providers/FamilyProvider";
import { addEvent } from "@/services/events";

export default function HealthForm() {
  const { family, setFamily } = useFamily();

  const [temperature, setTemperature] = useState("");
  const [medicine, setMedicine] = useState("");
  const [dose, setDose] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  function handleSave() {
    if (!temperature.trim() && !medicine.trim()) return;

    const title = temperature
      ? `Température : ${temperature}°C`
      : `Médicament : ${medicine}`;

    const description = [
      medicine ? `Médicament : ${medicine}` : "",
      dose ? `Dose : ${dose}` : "",
      time ? `Heure : ${time}` : "",
      notes ? `Notes : ${notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    setFamily(
      addEvent(family, {
        type: "health",
        title,
        description,
        date: new Date().toISOString(),
        images: [],
        favorite: false,
      })
    );

    setTemperature("");
    setMedicine("");
    setDose("");
    setTime("");
    setNotes("");
  }

  return (
    <Card>
      <h2 className="text-2xl font-semibold text-[#2F2F2F]">
        Ajouter un suivi santé
      </h2>

      <div className="mt-6 space-y-4">
        <Input
          value={temperature}
          onChange={setTemperature}
          placeholder="Température, ex : 38.7"
        />

        <Input
          value={medicine}
          onChange={setMedicine}
          placeholder="Médicament administré"
        />

        <Input
          value={dose}
          onChange={setDose}
          placeholder="Dose, ex : 5 ml"
        />

        <Input
          type="time"
          value={time}
          onChange={setTime}
        />

        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Notes, symptômes, évolution..."
          className="min-h-28 w-full rounded-2xl border border-gray-300 bg-white p-4 outline-none transition focus:border-[#7C9A7A]"
        />
      </div>

      <div className="mt-6">
        <Button onClick={handleSave}>Enregistrer</Button>
      </div>
    </Card>
  );
}