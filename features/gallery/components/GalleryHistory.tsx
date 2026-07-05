"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useFamily } from "@/providers/FamilyProvider";
import { deleteEvent } from "@/services/events";
import { LegacyEvent } from "@/types/Event";

type Props = {
  onEdit: (event: LegacyEvent) => void;
};

export default function GalleryHistory({ onEdit }: Props) {
  const { family, setFamily } = useFamily();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const photos = (family.events ?? [])
    .filter((event) => event.type === "photo")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <>
      <Card>
        <h2 className="text-xl font-semibold text-black">Galerie</h2>

        {photos.length === 0 ? (
          <p className="mt-4 text-black">Aucune photo enregistrée.</p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
              >
                <div
                  className="cursor-pointer"
                  onClick={() =>
                    photo.images.length > 0 && setSelectedImage(photo.images[0])
                  }
                >
                  {photo.images.length > 0 ? (
                    <img
                      src={photo.images[0]}
                      alt={photo.title}
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-40 items-center justify-center bg-gray-100 text-5xl">
                      📷
                    </div>
                  )}
                </div>

                <div className="space-y-2 p-3">
                  <p className="font-semibold text-black">{photo.title}</p>

                  <p className="text-xs text-gray-700">
                    {new Date(photo.date).toLocaleDateString("fr-FR")}
                  </p>

                  <Button onClick={() => onEdit(photo)}>Modifier</Button>

                  <Button
                    onClick={() =>
                      setFamily((current) => deleteEvent(current, photo.id))
                    }
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
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