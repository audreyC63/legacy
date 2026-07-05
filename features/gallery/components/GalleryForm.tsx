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

export default function GalleryForm({ editingEvent, onDone }: Props) {
  const { setFamily } = useFamily();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (!editingEvent) return;

    setTitle(editingEvent.title.replace("📸 ", ""));
    setDescription(editingEvent.description);
    setDate(editingEvent.date.split("T")[0]);
    setImage(editingEvent.images[0] ?? "");
  }, [editingEvent]);

  function handleImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  }

  function savePhoto() {
    if (!title.trim()) return;

    const payload = {
      title: `📸 ${title}`,
      description,
      date: date || new Date().toISOString(),
      images: image ? [image] : [],
    };

    if (editingEvent) {
      setFamily((current) => updateEvent(current, editingEvent.id, payload));
      onDone?.();
      return;
    }

    setFamily((current) =>
      addEvent(current, {
        type: "photo",
        ...payload,
        favorite: false,
      })
    );

    setTitle("");
    setDate("");
    setDescription("");
    setImage("");
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold text-black">
        {editingEvent ? "Modifier la photo" : "Nouvelle photo"}
      </h2>

      <div className="mt-5 space-y-4">
        <Input placeholder="Titre" value={title} onChange={setTitle} />

        <Input type="date" value={date} onChange={setDate} />

        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#7C9A7A] bg-[#EDF5EC] p-6 text-center">
          <span className="text-4xl">📸</span>
          <span className="mt-2 font-semibold text-black">
            Ajouter une photo
          </span>
          <span className="mt-1 text-sm text-gray-700">
            Touchez ici pour choisir une image
          </span>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImage}
          />
        </label>

        {image && (
          <img
            src={image}
            alt="Aperçu"
            className="h-48 w-full rounded-xl object-cover"
          />
        )}

        <Textarea
          value={description}
          onChange={setDescription}
          placeholder="Description"
        />

        <Button onClick={savePhoto}>
          {editingEvent ? "Mettre à jour" : "Enregistrer"}
        </Button>
      </div>
    </Card>
  );
}