import Link from "next/link";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function FamilySetupCard() {
  return (
    <Card>
      <p className="text-sm text-black">
        Première configuration
      </p>

      <h2 className="mt-2 text-2xl font-semibold text-black">
        Créons votre famille
      </h2>

      <p className="mt-4 text-black">
        En quelques étapes, Legacy sera prêt à raconter votre histoire.
      </p>

      <div className="mt-8">
        <Link href="/onboarding/family/child-name">
          <Button>
            Commencer
          </Button>
        </Link>
      </div>
    </Card>
  );
}