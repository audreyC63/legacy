"use client";

import BottomNavigation from "@/components/navigation/BottomNavigation";
import PageHeader from "@/components/ui/PageHeader";

import ChildHeroCard from "@/features/dashboard/components/ChildHeroCard";
import QuickActionsGrid from "@/features/dashboard/components/QuickActionsGrid";
import RecentEventsCard from "@/features/dashboard/components/RecentEventsCard";
import TodayCard from "@/features/dashboard/components/TodayCard";

import { useFamily } from "@/providers/FamilyProvider";

export default function DashboardPage() {
  const { family } = useFamily();

  const welcome =
    family.parentOne && family.parentTwo
      ? `Bonjour ${family.parentOne} & ${family.parentTwo} ❤️`
      : family.parentOne
        ? `Bonjour ${family.parentOne} ❤️`
        : "Bienvenue ❤️";

  return (
    <main className="min-h-screen bg-[#F8F6F2]">
      <div className="mx-auto flex max-w-md flex-col gap-6 px-6 pb-56 pt-10">
        <PageHeader title="Legacy" subtitle={welcome} />

        <ChildHeroCard
          childName={family.childName}
          isBorn={family.isBorn}
          birthDate={family.birthDate}
          pregnancyDate={family.pregnancyDate}
          profilePhoto={family.profilePhoto}
        />

        <QuickActionsGrid />

        <TodayCard isBorn={family.isBorn} />

        <RecentEventsCard events={family.events ?? []} />
      </div>

      <BottomNavigation />
    </main>
  );
}