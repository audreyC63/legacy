"use client";

import PageHeader from "@/components/ui/PageHeader";
import { useFamily } from "@/providers/FamilyProvider";
import ChildHeroCard from "@/features/dashboard/components/ChildHeroCard";
import QuickActionsGrid from "@/features/dashboard/components/QuickActionsGrid";
import TodayCard from "@/features/dashboard/components/TodayCard";
import LatestEventsCard from "@/features/dashboard/components/LatestEventsCard";
import RecentEventsCard from "@/features/dashboard/components/RecentEventsCard";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import ChildSummaryCard from "@/features/dashboard/components/ChildSummaryCard";

export default function DashboardPage() {
  const { family } = useFamily();

  const welcome =
    family.parentOne && family.parentTwo
      ? `Bonjour ${family.parentOne} & ${family.parentTwo} ❤️`
      : "Bienvenue ❤️";

  return (
    <main className="min-h-screen bg-[#F8F6F2]">
      <div className="mx-auto flex max-w-md flex-col gap-6 px-6 pt-10 pb-56">
        <PageHeader
          title="Legacy"
          subtitle={welcome}
        />

        <ChildSummaryCard />

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
      <BottomNavigation />
    </main>
  );
}