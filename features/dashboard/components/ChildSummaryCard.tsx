"use client";

import Card from "@/components/ui/Card";
import { useFamily } from "@/providers/FamilyProvider";

export default function ChildSummaryCard() {
  const { family } = useFamily();

  const growth = [...(family.events ?? [])]
    .filter((event) => event.type === "growth")
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    )[0];

  return (
    <Card>
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EDF5EC] text-5xl">
          👶
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#2F2F2F]">
            {family.childName || "Votre enfant"}
          </h2>

          {growth ? (
            <p className="mt-2 whitespace-pre-line text-sm text-[#6B6B6B]">
              {growth.description}
            </p>
          ) : (
            <p className="mt-2 text-sm text-[#6B6B6B]">
              Aucune mesure enregistrée.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}