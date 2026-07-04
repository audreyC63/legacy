import PageHeader from "@/components/ui/PageHeader";
import BottomNavigation from "@/components/navigation/BottomNavigation";

import LatestGrowthCard from "@/features/growth/components/LatestGrowthCard";
import GrowthForm from "@/features/growth/components/GrowthForm";
import GrowthHistory from "@/features/growth/components/GrowthHistory";

export default function GrowthPage() {
  return (
    <main className="min-h-screen bg-[#F8F6F2]">
      <div className="mx-auto flex max-w-md flex-col gap-6 px-6 py-10 pb-40">
        <PageHeader
          title="Croissance"
          subtitle="Suivi des mesures"
        />

        <LatestGrowthCard />

        <GrowthForm />

        <GrowthHistory />
      </div>

      <BottomNavigation />
    </main>
  );
}