"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useFamily } from "@/providers/FamilyProvider";

export default function BirthStatusStep() {
  const { setFamily } = useFamily();

  return (
    <Card>
      <h2 className="text-2xl font-semibold text-black">
        Votre enfant est-il déjà né ?
      </h2>

      <p className="mt-2 text-black">
        Legacy adaptera l&apos;expérience selon votre réponse.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        <Link href="/onboarding/family/birth-date">
          <Button onClick={() => setFamily((current) => ({ ...current, isBorn: true }))}>
            👶 Oui
          </Button>
        </Link>

        <Link href="/onboarding/family/pregnancy-date">
          <Button onClick={() => setFamily((current) => ({ ...current, isBorn: false }))}>
            🤰 Non, nous l&apos;attendons
          </Button>
        </Link>
      </div>
    </Card>
  );
}