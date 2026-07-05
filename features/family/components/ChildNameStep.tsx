"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { useFamily } from "@/providers/FamilyProvider";

export default function ChildNameStep() {
  const { family, setFamily } = useFamily();

  return (
    <Card>
      <h2 className="text-2xl font-semibold text-black">
        Quel est le prénom de votre enfant ?
      </h2>

      <p className="mt-2 text-black">
        Vous pourrez le modifier plus tard.
      </p>

      <div className="mt-8">
        <Input
          value={family.childName}
          onChange={(value) =>
            setFamily((current) => ({ ...current, childName: value }))
          }
          placeholder="Prénom"
        />
      </div>

      <div className="mt-8">
        <Link href="/onboarding/family/birth-status">
          <Button>Continuer</Button>
        </Link>
      </div>
    </Card>
  );
}