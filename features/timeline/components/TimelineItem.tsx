"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

import { useFamily } from "@/providers/FamilyProvider";
import { deleteEvent, toggleFavorite, updateEvent } from "@/services/events";
import { LegacyEvent } from "@/types/Event";

type Props = {
  event: LegacyEvent;
};

const styles = {
  memory: { icon: "❤️", label: "Souvenir", bg: "bg-red-50" },
  photo: { icon: "📸", label: "Photo", bg: "bg-blue-50" },
  growth: { icon: "📈", label: "Croissance", bg: "bg-green-50" },
  health: { icon: "🩺", label: "Santé", bg: "bg-yellow-50" },
  pregnancy: { icon: "🤰", label: "Grossesse", bg: "bg-purple-50" },
};

export default function TimelineItem({ event }: Props) {
  const { setFamily } = useFamily();

  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [date, setDate] = useState(event.date.split("T")[0]);

  const style = styles[event.type];

  function saveEdit() {
    setFamily((current) =>
      updateEvent(current, event.id, {
        title,
        description,
        date: date || event.date,
      })
    );

    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <Card>
        <h3 className="text-xl font-semibold text-black">
          Modifier l'événement
        </h3>

        <div className="mt-5 space-y-4">
          <Input value={title} onChange={setTitle} placeholder="Titre" />

          <Input type="date" value={date} onChange={setDate} />

          <Textarea
            value={description}
            onChange={setDescription}
            placeholder="Description"
          />

          <Button onClick={saveEdit}>Mettre à jour</Button>

          <Button onClick={() => setIsEditing(false)}>Annuler</Button>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <div className={`rounded-2xl p-4 ${style.bg}`}>
          <div className="flex gap-4">
            <div className="text-3xl">{style.icon}</div>

            <div className="flex-1">
              <p className="text-xs font-semibold text-black">
                {style.label} •{" "}
                {new Date(event.date).toLocaleDateString("fr-FR")}
              </p>

              <h3 className="mt-1 text-lg font-semibold text-black">
                {event.favorite ? "⭐ " : ""}
                {event.title}
              </h3>

              {event.description && (
                <p className="mt-2 whitespace-pre-line text-sm text-black">
                  {event.description}
                </p>
              )}

              {event.images.length > 0 && (
                <img
                  src={event.images[0]}
                  alt={event.title}
                  onClick={() => setSelectedImage(event.images[0])}
                  className="mt-4 h-48 w-full cursor-pointer rounded-2xl object-cover"
                />
              )}

              <div className="mt-4 space-y-2">
                <Button
                  onClick={() =>
                    setFamily((current) =>
                      toggleFavorite(current, event.id)
                    )
                  }
                >
                  {event.favorite
                    ? "⭐ Retirer des favoris"
                    : "☆ Ajouter aux favoris"}
                </Button>

                <Button onClick={() => setIsEditing(true)}>Modifier</Button>

                <Button
                  onClick={() =>
                    setFamily((current) =>
                      deleteEvent(current, event.id)
                    )
                  }
                >
                  Supprimer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Photo"
            className="max-h-full max-w-full rounded-2xl"
          />
        </div>
      )}
    </>
  );
}