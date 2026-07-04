import PageHeader from "@/components/ui/PageHeader";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import SettingsPanel from "@/features/settings/components/SettingsPanel";

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-[#F8F6F2]">
      <div className="mx-auto flex max-w-md flex-col gap-6 px-6 py-10 pb-40">
        <PageHeader title="Paramètres" subtitle="Gérer Legacy." />

        <SettingsPanel />
      </div>

      <BottomNavigation />
    </main>
  );
}