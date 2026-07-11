"use client";

import { useState } from "react";

import PageHeader from "@/components/ui/PageHeader";
import BottomNavigation from "@/components/navigation/BottomNavigation";

import LatestGrowthCard from "@/features/growth/components/LatestGrowthCard";
import GrowthCharts from "@/features/growth/components/GrowthCharts";
import GrowthForm from "@/features/growth/components/GrowthForm";
import GrowthHistory from "@/features/growth/components/GrowthHistory";

import { LegacyEvent } from "@/types/Event";

export default function GrowthPage() {
  const [editingEvent, setEditingEvent] =
    useState<LegacyEvent | null>(null);

  return (
    <main className="min-h-screen bg-[#F8F6F2]">
      <div className="mx-auto flex max-w-md flex-col gap-6 px-6 py-10 pb-56">
        <PageHeader
          title="Croissance"
          subtitle="Suivi des mesures"
        />

        <LatestGrowthCard />

        <GrowthCharts />

        <GrowthForm
          editingEvent={editingEvent}
          onDone={() => setEditingEvent(null)}
        />

        <GrowthHistory onEdit={setEditingEvent} />
      </div>

      <BottomNavigation />
    </main>
  );
}