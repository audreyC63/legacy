"use client";

import Card from "@/components/ui/Card";
import { useFamily } from "@/providers/FamilyProvider";

export default function GalleryHistory() {
  const { family } = useFamily();

  const photos = (family.events ?? [])
    .filter((event) => event.type === "photo")
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    );

  return (
    <Card>
      <h2 className="text-xl font-semibold">
        Galerie
      </h2>

      {photos.length === 0 ? (
        <p className="mt-4 text-gray-500">
          Aucune photo enregistrée.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
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

              <div className="p-3">
                <p className="font-semibold">
                  {photo.title}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {new Date(photo.date).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}