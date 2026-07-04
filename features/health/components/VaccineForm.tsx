"use client";

import { useState } from "react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import { useFamily } from "@/providers/FamilyProvider";
import { addEvent } from "@/services/events";

export default function VaccineForm() {
  const { family, setFamily } = useFamily();

  const [name, setName] = useState("");
  const [doctor, setDoctor] = useState("");
  const [nextReminder, setNextReminder] = useState("");
  const [notes, setNotes] = useState("");

  function saveVaccine() {
    if (!name.trim()) return;

    setFamily((current) =>
      addEvent(current, {
        type: "health",
        title: `💉 ${name}`,
        description: [
          doctor && `Professionnel : ${doctor}`,
          nextReminder && `Prochain rappel : ${nextReminder}`,
          notes,
        ]
          .filter(Boolean)
          .join("\n"),
        date: new Date().toISOString(),
        images: [],
        favorite: false,
      })
    );

    setName("");
    setDoctor("");
    setNextReminder("");
    setNotes("");
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold">
        Vaccin
      </h2>

      <div className="mt-5 space-y-4">
        <Input
          placeholder="Nom du vaccin"
          value={name}
          onChange={setName}
        />

        <Input
          placeholder="Médecin / Infirmier"
          value={doctor}
          onChange={setDoctor}
        />

        <Input
          type="date"
          value={nextReminder}
          onChange={setNextReminder}
        />

        <textarea
          className="min-h-28 w-full rounded-xl border border-gray-300 p-4"
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <Button onClick={saveVaccine}>
          Enregistrer le vaccin
        </Button>
      </div>
    </Card>
  );
}