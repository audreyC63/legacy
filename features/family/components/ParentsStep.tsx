"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useFamily } from "@/providers/FamilyProvider";

export default function ParentsStep() {
  const { family, setFamily } = useFamily();

  return (
    <Card>
      <h2 className="text-2xl font-semibold text-[#2F2F2F]">
        Parlons de votre famille
      </h2>

      <p className="mt-2 text-[#6B6B6B]">
        Renseignez le prénom des deux mamans.
      </p>

      <div className="mt-8 space-y-4">
        <Input
          value={family.motherOne}
          onChange={(value) =>
            setFamily((current) => ({ ...current, motherOne: value }))
          }
          placeholder="Prénom de la première maman"
        />

        <Input
          value={family.motherTwo}
          onChange={(value) =>
            setFamily((current) => ({ ...current, motherTwo: value }))
          }
          placeholder="Prénom de la deuxième maman"
        />
      </div>

      <div className="mt-8">
        <Link href="/onboarding/family/photo">
          <Button>Continuer</Button>
        </Link>
      </div>
    </Card>
  );
}