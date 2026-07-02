"use client";

import PageHeader from "@/components/ui/PageHeader";
import TimelineList from "@/features/timeline/components/TimelineList";
import { useFamily } from "@/providers/FamilyProvider";

export default function TimelinePage() {
  const { family } = useFamily();

  return (
    <main className="min-h-screen bg-[#F8F6F2]">
      <div className="mx-auto flex max-w-md flex-col gap-6 px-6 py-10">
        <PageHeader
          title="Timeline"
          subtitle="Toute votre histoire."
        />

        <TimelineList
          events={family.events ?? []}
        />
      </div>
    </main>
  );
}