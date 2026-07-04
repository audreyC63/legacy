import PageHeader from "@/components/ui/PageHeader";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import AddMemoryForm from "@/features/memories/components/AddMemoryForm";

export default function MemoriesPage() {
  return (
    <main className="min-h-screen bg-[#F8F6F2]">
      <div className="mx-auto flex max-w-md flex-col gap-6 px-6 py-10 pb-28">
        <PageHeader title="Souvenirs" subtitle="Gardez les moments importants." />

        <AddMemoryForm />
      </div>

      <BottomNavigation />
    </main>
  );
}