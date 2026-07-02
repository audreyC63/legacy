import PageHeader from "@/components/ui/PageHeader";
import HealthForm from "@/features/health/components/HealthForm";

export default function HealthPage() {
  return (
    <main className="min-h-screen bg-[#F8F6F2]">
      <div className="mx-auto flex max-w-md flex-col gap-6 px-6 py-10">
        <PageHeader
          title="Santé"
          subtitle="Température, médicaments, vaccins et suivi médical."
        />

        <HealthForm />
      </div>
    </main>
  );
}