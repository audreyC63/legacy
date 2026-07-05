"use client";

import { useState } from "react";

import PageHeader from "@/components/ui/PageHeader";
import BottomNavigation from "@/components/navigation/BottomNavigation";

import GalleryForm from "@/features/gallery/components/GalleryForm";
import GalleryHistory from "@/features/gallery/components/GalleryHistory";
import { LegacyEvent } from "@/types/Event";

export default function GalleryPage() {
  const [editingEvent, setEditingEvent] =
    useState<LegacyEvent | null>(null);

  return (
    <main className="min-h-screen bg-[#F8F6F2]">
      <div className="mx-auto flex max-w-md flex-col gap-6 px-6 py-10 pb-56">
        <PageHeader
          title="Galerie"
          subtitle="Toutes les photos de votre enfant"
        />

        <GalleryForm
          editingEvent={editingEvent}
          onDone={() => setEditingEvent(null)}
        />

        <GalleryHistory onEdit={setEditingEvent} />
      </div>

      <BottomNavigation />
    </main>
  );
}