"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

import { useFamily } from "@/providers/FamilyProvider";
import {
  addEvent,
  deleteEvent,
  toggleFavorite,
} from "@/services/events";
import { compressImage } from "@/utils/imageUtils";

function toIsoDate(date: string) {
  const [day, month, year] = date.split("/");

  if (!day || !month || !year) {
    return new Date().toISOString();
  }

  return `${year}-${month.padStart(
    2,
    "0"
  )}-${day.padStart(2, "0")}T00:00:00`;
}

function toDisplayDate(date: string) {
  if (!date) return "";

  return new Date(date).toLocaleDateString(
    "fr-FR"
  );
}

export default function AddMemoryForm() {
  const { family, setFamily } = useFamily();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] =
    useState("");
  const [image, setImage] = useState("");
  const [imageLoading, setImageLoading] =
    useState(false);
  const [editingId, setEditingId] = useState<
    string | null
  >(null);

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
      window.alert(
        "Cette image n'a pas pu être ajoutée."
      );
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
    setEditingId(null);
  }

  function handleSave() {
    if (!title.trim()) return;

    if (editingId) {
      setFamily((current) => ({
        ...current,
        events: current.events.map((event) =>
          event.id === editingId
            ? {
                ...event,
                title,
                description,
                date: date
                  ? toIsoDate(date)
                  : event.date,
                images: image ? [image] : [],
              }
            : event
        ),
      }));
    } else {
      setFamily((current) =>
        addEvent(current, {
          type: "memory",
          title,
          description,
          date: date
            ? toIsoDate(date)
            : new Date().toISOString(),
          images: image ? [image] : [],
          favorite: false,
        })
      );
    }

    resetForm();
  }

  const memories = (family.events ?? [])
    .filter((event) => event.type === "memory")
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    );

  return (
    <>
      <Card>
        <h2 className="text-2xl font-semibold text-black">
          {editingId
            ? "Modifier le souvenir"
            : "Ajouter un souvenir"}
        </h2>

        <div className="mt-6 space-y-4">
          <Input
            value={title}
            onChange={setTitle}
            placeholder="Titre"
          />

          <Input
            value={date}
            onChange={setDate}
            placeholder="Date (JJ/MM/AAAA)"
          />

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#7C9A7A] bg-[#EDF5EC] p-6 text-center">
            <span className="text-4xl">📸</span>

            <span className="mt-2 font-semibold text-black">
              {image
                ? "Changer la photo"
                : "Ajouter une photo"}
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
                alt="Aperçu du souvenir"
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
            placeholder="Racontez ce moment..."
          />
        </div>

        <div className="mt-6">
          <Button
            onClick={handleSave}
            disabled={imageLoading}
          >
            {editingId
              ? "Mettre à jour"
              : "Enregistrer"}
          </Button>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-black">
          Souvenirs enregistrés
        </h2>

        <div className="mt-4 space-y-5">
          {memories.length === 0 ? (
            <p className="text-black">
              Aucun souvenir.
            </p>
          ) : (
            memories.map((memory) => (
              <div
                key={memory.id}
                className="border-b border-gray-200 pb-5 last:border-b-0"
              >
                {memory.images?.[0] && (
                  <img
                    src={memory.images[0]}
                    alt={memory.title}
                    className="mb-4 h-48 w-full rounded-2xl object-cover"
                  />
                )}

                <p className="font-semibold text-black">
                  {memory.favorite ? "⭐ " : ""}
                  {memory.title}
                </p>

                <p className="mt-1 text-xs text-gray-700">
                  {new Date(
                    memory.date
                  ).toLocaleDateString("fr-FR")}
                </p>

                <p className="mt-2 whitespace-pre-line text-sm text-black">
                  {memory.description}
                </p>

                <div className="mt-4 space-y-2">
                  <Button
                    onClick={() => {
                      setEditingId(memory.id);
                      setTitle(memory.title);
                      setDate(
                        toDisplayDate(memory.date)
                      );
                      setDescription(
                        memory.description
                      );
                      setImage(
                        memory.images?.[0] ?? ""
                      );

                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    }}
                  >
                    Modifier
                  </Button>

                  <Button
                    onClick={() =>
                      setFamily((current) =>
                        toggleFavorite(
                          current,
                          memory.id
                        )
                      )
                    }
                  >
                    {memory.favorite
                      ? "⭐ Retirer des favoris"
                      : "☆ Ajouter aux favoris"}
                  </Button>

                  <Button
                    onClick={() =>
                      setFamily((current) =>
                        deleteEvent(
                          current,
                          memory.id
                        )
                      )
                    }
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </>
  );
}