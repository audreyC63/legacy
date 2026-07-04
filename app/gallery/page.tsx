import PageHeader from "@/components/ui/PageHeader";
import BottomNavigation from "@/components/navigation/BottomNavigation";

import GalleryForm from "@/features/gallery/components/GalleryForm";
import GalleryHistory from "@/features/gallery/components/GalleryHistory";

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-[#F8F6F2]">
      <div className="mx-auto flex max-w-md flex-col gap-6 px-6 py-10 pb-28">
        <PageHeader
          title="Galerie"
          subtitle="Toutes les photos de votre enfant"
        />

        <GalleryForm />

        <GalleryHistory />
      </div>

      <BottomNavigation />
    </main>
  );
}