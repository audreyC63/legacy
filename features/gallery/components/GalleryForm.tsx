/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import { useEffect, useState } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

import { useFamily } from "@/providers/FamilyProvider";
import { addEvent, updateEvent } from "@/services/events";
import { LegacyEvent } from "@/types/Event";
import { compressImage } from "@/utils/imageUtils";

type Props = {
  editingEvent?: LegacyEvent | null;
  onDone?: () => void;
};

function toIsoDate(date: string) {
  const [day, month, year] = date.split("/");

  if (!day || !month || !year) {
    return new Date().toISOString();
  }

  return `${year}-${month.padStart(2, "0")}-${day.padStart(
    2,
    "0"
  )}T00:00:00`;
}

function toDisplayDate(date: string) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("fr-FR");
}

export default function GalleryForm({
  editingEvent,
  onDone,
}: Props) {
  const { setFamily } = useFamily();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    if (!editingEvent) return;

    setTitle(editingEvent.title.replace(/^📸\s*/, ""));
    setDate(toDisplayDate(editingEvent.date));
    setDescription(editingEvent.description);
    setImage(editingEvent.images?.[0] ?? "");
  }, [editingEvent]);

  async function handleImage(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setImageLoading(true);

    try {
      const compressed = await compressImage(file);
      setImage(compressed);
    } catch {
      window.alert("Cette image n'a pas pu être ajoutée.");
    } finally {
      setImageLoading(false);
      event.target.value = "";
    }
  }

  function resetForm() {
    setTitle("");
    setDate("");
    setDescription("");
    setImage("");
  }

  function savePhoto() {
    if (!title.trim()) {
      window.alert("Veuillez saisir un titre.");
      return;
    }

    if (!image) {
      window.alert("Veuillez choisir une photo.");
      return;
    }

    const eventDate = date
      ? toIsoDate(date)
      : editingEvent?.date ?? new Date().toISOString();

    const payload = {
      title: `📸 ${title.trim()}`,
      description,
      date: eventDate,
      images: [image],
    };

    if (editingEvent) {
      setFamily((current) =>
        updateEvent(current, editingEvent.id, payload)
      );

      resetForm();
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

    resetForm();
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold text-black">
        {editingEvent ? "Modifier la photo" : "Nouvelle photo"}
      </h2>

      <div className="mt-5 space-y-4">
        <Input
          placeholder="Titre"
          value={title}
          onChange={setTitle}
        />

        <Input
          placeholder="Date (JJ/MM/AAAA)"
          value={date}
          onChange={setDate}
        />

        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#7C9A7A] bg-[#EDF5EC] p-6 text-center">
          <span className="text-4xl">📸</span>

          <span className="mt-2 font-semibold text-black">
            {image ? "Changer la photo" : "Ajouter une photo"}
          </span>

          <span className="mt-1 text-sm text-black">
            Touchez ici pour choisir une image
          </span>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImage}
          />
        </label>

        {imageLoading && (
          <p className="text-center text-sm text-black">
            Préparation de l’image…
          </p>
        )}

        {image && (
          <div>
            <img
              src={image}
              alt="Aperçu"
              className="h-52 w-full rounded-2xl object-cover"
            />

            <button
              type="button"
              onClick={() => setImage("")}
              className="mt-2 font-semibold text-red-700"
            >
              Retirer la photo
            </button>
          </div>
        )}

        <Textarea
          value={description}
          onChange={setDescription}
          placeholder="Description"
        />

        <Button
          onClick={savePhoto}
          disabled={imageLoading}
        >
          {editingEvent ? "Mettre à jour" : "Enregistrer"}
        </Button>
      </div>
    </Card>
  );
}