"use client";

import { useState } from "react";

import PageHeader from "@/components/ui/PageHeader";
import BottomNavigation from "@/components/navigation/BottomNavigation";

import HealthForm from "@/features/health/components/HealthForm";
import MedicationForm from "@/features/health/components/MedicationForm";
import HealthHistory from "@/features/health/components/HealthHistory";
import HealthMenu, { HealthTab } from "@/features/health/components/HealthMenu";
import VaccineForm from "@/features/health/components/VaccineForm";
import HospitalizationForm from "@/features/health/components/HospitalizationForm";
import AllergyForm from "@/features/health/components/AllergyForm";
import MedicalDocumentForm from "@/features/health/components/MedicalDocumentForm";

export default function HealthPage() {
  const [tab, setTab] = useState<HealthTab>("temperature");

  return (
    <main className="min-h-screen bg-[#F8F6F2]">
      <div className="mx-auto flex max-w-md flex-col gap-6 px-6 py-10 pb-28">
        <PageHeader title="Santé" subtitle="Suivi médical" />

        <HealthMenu selected={tab} onSelect={setTab} />

        {tab === "temperature" && <HealthForm />}
        {tab === "medication" && <MedicationForm />}
        {tab === "vaccines" && <VaccineForm />}
        {tab === "hospitalizations" && <HospitalizationForm />}
        {tab === "allergies" && <AllergyForm />}
        {tab === "documents" && <MedicalDocumentForm />}

        <HealthHistory />
      </div>

      <BottomNavigation />
    </main>
  );
}