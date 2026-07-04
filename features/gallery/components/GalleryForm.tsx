"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

import { useFamily } from "@/providers/FamilyProvider";
import { addEvent } from "@/services/events";

export default function GalleryForm() {
  const { setFamily } = useFamily();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState("");

  function handleImage(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    const url = URL.createObjectURL(file);

    setPreview(url);
  }

  function savePhoto() {
    if (!title.trim()) return;

    setFamily((current) =>
      addEvent(current, {
        type: "photo",
        title: `📸 ${title}`,
        description,
        date: date || new Date().toISOString(),
        images: preview ? [preview] : [],
        favorite: false,
      })
    );

    setTitle("");
    setDate("");
    setDescription("");
    setPreview("");
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold">
        Nouvelle photo
      </h2>

      <div className="mt-5 space-y-4">
        <Input
          placeholder="Titre"
          value={title}
          onChange={setTitle}
        />

        <Input
          type="date"
          value={date}
          onChange={setDate}
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
        />

        {preview && (
          <img
            src={preview}
            alt="Aperçu"
            className="h-48 w-full rounded-xl object-cover"
          />
        )}

        <textarea
          className="min-h-28 w-full rounded-xl border border-gray-300 p-4"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Button onClick={savePhoto}>
          Enregistrer
        </Button>
      </div>
    </Card>
  );
}