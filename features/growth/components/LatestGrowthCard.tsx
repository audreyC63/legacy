"use client";

import Card from "@/components/ui/Card";
import { useFamily } from "@/providers/FamilyProvider";

export default function LatestGrowthCard() {
  const { family } = useFamily();

  const latest = [...(family.events ?? [])]
    .filter((event) => event.type === "growth")
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    )[0];

  if (!latest) {
    return (
      <Card>
        <h2 className="text-xl font-semibold">
          Dernière mesure
        </h2>

        <p className="mt-4 text-black">
          Aucune mesure enregistrée.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold">
        Dernière mesure
      </h2>

      <p className="mt-4 whitespace-pre-line text-black">
        {latest.description}
      </p>

      <p className="mt-4 text-xs text-gray-400">
        {new Date(latest.date).toLocaleDateString("fr-FR")}
      </p>
    </Card>
  );
}