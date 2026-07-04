"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

import { useFamily } from "@/providers/FamilyProvider";
import { addEvent } from "@/services/events";

export default function MedicalDocumentForm() {
  const { setFamily } = useFamily();

  const [title, setTitle] = useState("");
  const [doctor, setDoctor] = useState("");
  const [documentDate, setDocumentDate] = useState("");
  const [notes, setNotes] = useState("");

  function saveDocument() {
    if (!title.trim()) return;

    setFamily((current) =>
      addEvent(current, {
        type: "health",
        title: `📄 ${title}`,
        description: [
          doctor && `Professionnel : ${doctor}`,
          documentDate && `Date : ${documentDate}`,
          notes,
        ]
          .filter(Boolean)
          .join("\n"),
        date: documentDate || new Date().toISOString(),
        images: [],
        favorite: false,
      })
    );

    setTitle("");
    setDoctor("");
    setDocumentDate("");
    setNotes("");
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold">
        Document médical
      </h2>

      <div className="mt-5 space-y-4">
        <Input
          placeholder="Titre du document"
          value={title}
          onChange={setTitle}
        />

        <Input
          placeholder="Médecin / Hôpital"
          value={doctor}
          onChange={setDoctor}
        />

        <Input
          type="date"
          value={documentDate}
          onChange={setDocumentDate}
        />

        <textarea
          className="min-h-28 w-full rounded-xl border border-gray-300 p-4"
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <Button onClick={saveDocument}>
          Enregistrer le document
        </Button>
      </div>
    </Card>
  );
}