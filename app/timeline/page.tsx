"use client";

import { useState } from "react";

import PageHeader from "@/components/ui/PageHeader";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import TimelineFilters from "@/features/timeline/components/TimelineFilters";
import TimelineList from "@/features/timeline/components/TimelineList";
import TimelineSearch from "@/features/timeline/components/TimelineSearch";
import { useFamily } from "@/providers/FamilyProvider";

type Filter = "all" | "memory" | "photo" | "growth" | "health";

export default function TimelinePage() {
  const { family } = useFamily();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const events = (family.events ?? []).filter((event) => {
    const query = search.toLowerCase();

    const matchesSearch =
      event.title.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query);

    const matchesFilter = filter === "all" || event.type === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <main className="min-h-screen bg-[#F8F6F2]">
      <div className="mx-auto flex max-w-md flex-col gap-6 px-6 py-10 pb-28">
        <PageHeader title="Timeline" subtitle="Toute votre histoire." />

        <TimelineSearch value={search} onChange={setSearch} />

        <TimelineFilters value={filter} onChange={setFilter} />

        <TimelineList events={events} />
      </div>

      <BottomNavigation />
    </main>
  );
}