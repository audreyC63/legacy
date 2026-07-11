"use client";

import { useEffect, useState } from "react";

import BottomNavigation from "@/components/navigation/BottomNavigation";
import PageHeader from "@/components/ui/PageHeader";

import GalleryForm from "@/features/gallery/components/GalleryForm";
import GalleryHistory from "@/features/gallery/components/GalleryHistory";

import { useFamily } from "@/providers/FamilyProvider";
import { getCloudEvents } from "@/services/cloud/events";
import { getCloudEventImages } from "@/services/cloud/media";
import { LegacyEvent } from "@/types/Event";

export default function GalleryPage() {
  const {
    family,
    setFamily,
    cloudFamilyId,
    cloudChildId,
    cloudLoading,
  } = useFamily();

  const [editingEvent, setEditingEvent] =
    useState<LegacyEvent | null>(null);

  const [loadingPhotos, setLoadingPhotos] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    if (!cloudFamilyId || !cloudChildId) {
      return;
    }

    let active = true;

    async function loadPhotos() {
      setLoadingPhotos(true);
      setErrorMessage("");

      try {
        const cloudEvents = await getCloudEvents(
          cloudFamilyId as string,
          cloudChildId as string
        );

        const photoEvents = cloudEvents.filter(
          (event) => event.type === "photo"
        );

        const imagesByEvent = await getCloudEventImages(
          photoEvents.map((event) => event.id)
        );

        const photosWithImages = photoEvents.map(
          (event) => ({
            ...event,
            images: imagesByEvent[event.id] ?? [],
          })
        );

        if (!active) return;

        setFamily((current) => ({
          ...current,
          events: [
            ...(current.events ?? []).filter(
              (event) => event.type !== "photo"
            ),
            ...photosWithImages,
          ],
        }));
      } catch (error) {
        console.error(
          "Impossible de charger la galerie.",
          error
        );

        if (active) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Impossible de charger la galerie."
          );
        }
      } finally {
        if (active) {
          setLoadingPhotos(false);
        }
      }
    }

    void loadPhotos();

    return () => {
      active = false;
    };
  }, [
    cloudChildId,
    cloudFamilyId,
    setFamily,
  ]);

  return (
    <main className="min-h-screen bg-[#F8F6F2]">
      <div className="mx-auto flex max-w-md flex-col gap-6 px-6 py-10 pb-56">
        <PageHeader
          title="Galerie"
          subtitle="Toutes les photos de votre enfant"
        />

        {errorMessage && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800"
          >
            {errorMessage}
          </div>
        )}

        <GalleryForm
          key={editingEvent?.id ?? "new-photo"}
          editingEvent={editingEvent}
          onDone={() => setEditingEvent(null)}
        />

        <GalleryHistory
          onEdit={setEditingEvent}
          loading={loadingPhotos}
          cloudUnavailable={
            cloudLoading ||
            !cloudFamilyId ||
            !cloudChildId
          }
        />
      </div>

      <BottomNavigation />
    </main>
  );
}