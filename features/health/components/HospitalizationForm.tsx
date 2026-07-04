"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

import { useFamily } from "@/providers/FamilyProvider";
import { addEvent } from "@/services/events";

export default function HospitalizationForm() {
  const { setFamily } = useFamily();

  const [hospital, setHospital] = useState("");
  const [reason, setReason] = useState("");
  const [entryDate, setEntryDate] = useState("");
  const [exitDate, setExitDate] = useState("");
  const [notes, setNotes] = useState("");

  function saveHospitalization() {
    if (!hospital.trim()) return;

    setFamily((current) =>
      addEvent(current, {
        type: "health",
        title: `🏥 ${hospital}`,
        description: [
          reason && `Motif : ${reason}`,
          entryDate && `Entrée : ${entryDate}`,
          exitDate && `Sortie : ${exitDate}`,
          notes,
        ]
          .filter(Boolean)
          .join("\n"),
        date: entryDate || new Date().toISOString(),
        images: [],
        favorite: false,
      })
    );

    setHospital("");
    setReason("");
    setEntryDate("");
    setExitDate("");
    setNotes("");
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold">Hospitalisation</h2>

      <div className="mt-5 space-y-4">
        <Input
          placeholder="Hôpital"
          value={hospital}
          onChange={setHospital}
        />

        <Input
          placeholder="Motif"
          value={reason}
          onChange={setReason}
        />

        <Input
          type="date"
          value={entryDate}
          onChange={setEntryDate}
        />

        <Input
          type="date"
          value={exitDate}
          onChange={setExitDate}
        />

        <textarea
          className="min-h-28 w-full rounded-xl border border-gray-300 p-4"
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <Button onClick={saveHospitalization}>
          Enregistrer l'hospitalisation
        </Button>
      </div>
    </Card>
  );
}