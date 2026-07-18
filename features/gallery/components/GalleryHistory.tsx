"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import { useFamily } from "@/providers/FamilyProvider";

import {
  deleteCloudEvent,
  toggleCloudFavorite,
} from "@/services/cloud/events";

import {
  deleteCloudEventImages,
} from "@/services/cloud/media";

import { LegacyEvent } from "@/types/Event";

type Props = {
  onEdit: (event: LegacyEvent) => void;
  loading?: boolean;
  cloudUnavailable?: boolean;
};

export default function GalleryHistory({
  onEdit,
  loading = false,
  cloudUnavailable = false,
}: Props) {
  const { family, setFamily } = useFamily();

  const [selectedImage, setSelectedImage] =
    useState<string | null>(null);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [busyEventId, setBusyEventId] =
    useState<string | null>(null);

  const photos = (family.events ?? [])
    .filter((event) => event.type === "photo")
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    );

  async function handleFavorite(
    photo: LegacyEvent
  ) {
    setBusyEventId(photo.id);
    setErrorMessage("");

    try {
      const updated =
        await toggleCloudFavorite(
          photo.id,
          !photo.favorite
        );

      setFamily((current) => ({
        ...current,
        events: current.events.map(
          (event) =>
            event.id === photo.id
              ? {
                  ...updated,
                  images: photo.images,
                }
              : event
        ),
      }));
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Impossible de modifier le favori."
      );
    } finally {
      setBusyEventId(null);
    }
  }

  async function handleDelete(
    photo: LegacyEvent
  ) {
    const confirmed = window.confirm(
      `Supprimer la photo « ${photo.title} » ?`
    );

    if (!confirmed) return;

    setBusyEventId(photo.id);
    setErrorMessage("");

    try {
      await deleteCloudEventImages(photo.id);
      await deleteCloudEvent(photo.id);

      setFamily((current) => ({
        ...current,
        events: current.events.filter(
          (event) => event.id !== photo.id
        ),
      }));

      if (
        selectedImage &&
        photo.images.includes(selectedImage)
      ) {
        setSelectedImage(null);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Impossible de supprimer la photo."
      );
    } finally {
      setBusyEventId(null);
    }
  }

  return (
    <>
      <Card>
        <h2 className="text-xl font-semibold text-black">
          Galerie
        </h2>

        {errorMessage && (
          <div
            role="alert"
            className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800"
          >
            {errorMessage}
          </div>
        )}

        {cloudUnavailable ? (
          <p className="mt-4 text-black">
            Connectez-vous pour accéder à la
            galerie cloud.
          </p>
        ) : loading ? (
          <p className="mt-4 text-black">
            Chargement de la galerie…
          </p>
        ) : photos.length === 0 ? (
          <p className="mt-4 text-black">
            Aucune photo enregistrée dans le cloud.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4">
            {photos.map((photo) => {
              const busy =
                busyEventId === photo.id;

              return (
                <div
                  key={photo.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                >
                  <button
                    type="button"
                    className="block w-full"
                    onClick={() => {
                      const firstImage =
                        photo.images?.[0];

                      if (firstImage) {
                        setSelectedImage(
                          firstImage
                        );
                      }
                    }}
                  >
                    {photo.images?.[0] ? (
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
                  </button>

                  <div className="space-y-2 p-3">
                    <p className="break-words font-semibold text-black">
                      {photo.favorite
                        ? "⭐ "
                        : ""}
                      {photo.title}
                    </p>

                    <p className="text-xs text-gray-700">
                      {new Date(
                        photo.date
                      ).toLocaleDateString(
                        "fr-FR"
                      )}
                    </p>

                    <Button
                      onClick={() =>
                        void handleFavorite(
                          photo
                        )
                      }
                      disabled={busy}
                    >
                      {photo.favorite
                        ? "⭐ Retirer des favoris"
                        : "☆ Ajouter aux favoris"}
                    </Button>

                    <Button
                      onClick={() =>
                        onEdit(photo)
                      }
                      disabled={busy}
                    >
                      Modifier
                    </Button>

                    <Button
                      onClick={() =>
                        void handleDelete(photo)
                      }
                      disabled={busy}
                    >
                      {busy
                        ? "Veuillez patienter..."
                        : "Supprimer"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {selectedImage && (
        <div
          role="button"
          tabIndex={0}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-6"
          onClick={() =>
            setSelectedImage(null)
          }
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setSelectedImage(null);
            }
          }}
        >
          <div
            className="relative max-h-full max-w-full"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <img
              src={selectedImage}
              alt="Photo agrandie"
              className="max-h-[85vh] max-w-full rounded-2xl object-contain"
            />

            <button
              type="button"
              onClick={() =>
                setSelectedImage(null)
              }
              className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-2xl font-bold text-black shadow-lg"
              aria-label="Fermer"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}