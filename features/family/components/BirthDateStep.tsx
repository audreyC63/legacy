"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { useFamily } from "@/providers/FamilyProvider";

export default function BirthDateStep() {
  const { family, setFamily } = useFamily();

  return (
    <Card>
      <h2 className="text-2xl font-semibold text-[#2F2F2F]">
        Quelle est sa date de naissance ?
      </h2>

      <p className="mt-2 text-[#6B6B6B]">
        Legacy calculera son âge automatiquement.
      </p>

      <div className="mt-8">
        <Input
          type="date"
          value={family.birthDate}
          onChange={(value) =>
            setFamily((current) => ({ ...current, birthDate: value }))
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