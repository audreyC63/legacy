"use client";

import Card from "@/components/ui/Card";
import { useFamily } from "@/providers/FamilyProvider";

export default function ChildSummaryCard() {
  const { family } = useFamily();

  const events = family.events ?? [];

  const latestMemory = [...events]
    .filter((event) => event.type === "memory")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  const latestPhoto = [...events]
    .filter((event) => event.type === "photo")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  const latestGrowth = [...events]
    .filter((event) => event.type === "growth")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  const latestHealth = [...events]
    .filter((event) => event.type === "health")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  return (
    <Card>
      <div className="flex items-center gap-4">
        {family.profilePhoto ? (
          <img
            src={family.profilePhoto}
            alt={family.childName || "Enfant"}
            className="h-20 w-20 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EDF5EC] text-5xl">
            👶
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-black">
            {family.childName || "Votre enfant"}
          </h2>

          <p className="text-sm text-black">
            {family.birthPlace
              ? `Né(e) à ${family.birthPlace}`
              : "Livre de vie"}
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {family.birthWeight && (
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="font-semibold text-black">⚖️ Poids de naissance</p>
            <p className="mt-2 text-sm text-black">{family.birthWeight} kg</p>
          </div>
        )}

        {family.birthHeight && (
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="font-semibold text-black">📏 Taille de naissance</p>
            <p className="mt-2 text-sm text-black">{family.birthHeight} cm</p>
          </div>
        )}

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="font-semibold text-black">❤️ Dernier souvenir</p>
          <p className="mt-2 text-sm text-black">
            {latestMemory ? latestMemory.title : "Aucun souvenir"}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="font-semibold text-black">📸 Dernière photo</p>
          <p className="mt-2 text-sm text-black">
            {latestPhoto ? latestPhoto.title : "Aucune photo"}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="font-semibold text-black">📈 Dernière mesure</p>
          <p className="mt-2 whitespace-pre-line text-sm text-black">
            {latestGrowth ? latestGrowth.description : "Aucune mesure"}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="font-semibold text-black">🩺 Dernier suivi santé</p>
          <p className="mt-2 text-sm text-black">
            {latestHealth ? latestHealth.title : "Aucun événement"}
          </p>
        </div>
      </div>
    </Card>
  );
}