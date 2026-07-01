"use client";

import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import { useFamily } from "@/providers/FamilyProvider";

export default function DashboardPage() {
  const { family } = useFamily();

  const parents =
    family.motherOne && family.motherTwo
      ? `${family.motherOne} & ${family.motherTwo}`
      : "Votre famille";

  const childName = family.childName || "Votre enfant";

  return (
    <main className="min-h-screen bg-[#F8F6F2]">
      <div className="mx-auto flex max-w-md flex-col px-6 py-10">
        <PageHeader
          title="Legacy"
          subtitle={`Bienvenue ${parents} ❤️`}
        />

        <Card>
          <p className="text-sm text-gray-500">Livre de vie</p>

          <h2 className="mt-2 text-3xl font-bold text-[#2F2F2F]">
            {childName}
          </h2>

          <p className="mt-4 text-[#6B6B6B]">
            {family.isBorn === false
              ? "Votre histoire commence avant votre rencontre."
              : "Votre histoire commence ici."}
          </p>
        </Card>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <Card>
            <p className="text-2xl">❤️</p>
            <p className="mt-2 font-semibold">Souvenir</p>
          </Card>

          <Card>
            <p className="text-2xl">📸</p>
            <p className="mt-2 font-semibold">Photo</p>
          </Card>

          <Card>
            <p className="text-2xl">📈</p>
            <p className="mt-2 font-semibold">Croissance</p>
          </Card>

          <Card>
            <p className="text-2xl">🩺</p>
            <p className="mt-2 font-semibold">Santé</p>
          </Card>
        </div>
      </div>
    </main>
  );
}