"use client";

import PageHeader from "@/components/ui/PageHeader";
import { useFamily } from "@/providers/FamilyProvider";
import ChildHeroCard from "@/features/dashboard/components/ChildHeroCard";
import QuickActionsGrid from "@/features/dashboard/components/QuickActionsGrid";
import TodayCard from "@/features/dashboard/components/TodayCard";
import LatestEventsCard from "@/features/dashboard/components/LatestEventsCard";
import RecentEventsCard from "@/features/dashboard/components/RecentEventsCard";

export default function DashboardPage() {
  const { family } = useFamily();

  const welcome =
    family.motherOne && family.motherTwo
      ? `Bonjour ${family.motherOne} & ${family.motherTwo} ❤️`
      : "Bienvenue ❤️";

  return (
    <main className="min-h-screen bg-[#F8F6F2]">
      <div className="mx-auto flex max-w-md flex-col gap-6 px-6 py-10">
        <PageHeader
          title="Legacy"
          subtitle={welcome}
        />

        <ChildHeroCard
          childName={family.childName}
          isBorn={family.isBorn}
          birthDate={family.birthDate}
          pregnancyDate={family.pregnancyDate}
        />

        <QuickActionsGrid />

        <TodayCard isBorn={family.isBorn} />

       <RecentEventsCard
         events={family.events ?? []}
       />
      </div>
    </main>
  );
}