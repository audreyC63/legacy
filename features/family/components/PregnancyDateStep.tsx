"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { useFamily } from "@/providers/FamilyProvider";

export default function PregnancyDateStep() {
  const { family, setFamily } = useFamily();

  return (
    <Card>
      <h2 className="text-2xl font-semibold text-black">
        Quelle est la date prévue ?
      </h2>

      <p className="mt-2 text-black">
        Legacy affichera le temps restant avant votre rencontre.
      </p>

      <div className="mt-8">
        <Input
          type="date"
          value={family.pregnancyDate}
          onChange={(value) =>
            setFamily((current) => ({ ...current, pregnancyDate: value }))
          }
        />
      </div>

      <div className="mt-8">
        <Link href="/onboarding/family/parents">
          <Button>Continuer</Button>
        </Link>
      </div>
    </Card>
  );
}