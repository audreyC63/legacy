"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

import { useFamily } from "@/providers/FamilyProvider";
import { addEvent } from "@/services/events";

export default function MedicalDocumentForm() {
  const { setFamily } = useFamily();

  const [title, setTitle] = useState("");
  const [doctor, setDoctor] = useState("");
  const [documentDate, setDocumentDate] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState("");

  function handleDocumentPhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  }

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
        images: image ? [image] : [],
        favorite: false,
      })
    );

    setTitle("");
    setDoctor("");
    setDocumentDate("");
    setNotes("");
    setImage("");
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold text-black">Document médical</h2>

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

        <Input type="date" value={documentDate} onChange={setDocumentDate} />

        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#7C9A7A] bg-[#EDF5EC] p-6 text-center">
          <span className="text-4xl">📄</span>
          <span className="mt-2 font-semibold text-black">
            Ajouter une photo du document
          </span>
          <span className="mt-1 text-sm text-gray-700">
            Touchez ici pour choisir une image
          </span>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleDocumentPhoto}
          />
        </label>

        {image && (
          <img
            src={image}
            alt="Document médical"
            className="h-48 w-full rounded-xl object-cover"
          />
        )}

        <Textarea value={notes} onChange={setNotes} placeholder="Notes" />

        <Button onClick={saveDocument}>Enregistrer le document</Button>
      </div>
    </Card>
  );
}