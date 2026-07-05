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
      <h2 className="text-2xl font-semibold text-black">
        Parlons de votre famille
      </h2>

      <p className="mt-2 text-black">
        Renseignez les personnes qui accompagneront votre enfant.
      </p>

      <div className="mt-8 space-y-4">
        <Input
          value={family.parentOne}
          onChange={(value) =>
            setFamily((current) => ({
              ...current,
              parentOne: value,
            }))
          }
          placeholder="Prénom du parent 1"
        />

        <Input
          value={family.parentTwo}
          onChange={(value) =>
            setFamily((current) => ({
              ...current,
              parentTwo: value,
            }))
          }
          placeholder="Prénom du parent 2"
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