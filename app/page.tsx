import Link from "next/link";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8F6F2]">
      <div className="mx-auto flex max-w-md flex-col px-6 py-10">
        <PageHeader
          title="Legacy"
          subtitle="Chaque vie mérite d'être racontée."
        />

        <Card>
          <p className="text-sm font-semibold text-black">Bienvenue</p>

          <h2 className="mt-2 text-2xl font-semibold text-black">
            Bienvenue dans Legacy
          </h2>

          <p className="mt-4 text-black">
            Créez le livre de vie de votre enfant et conservez chaque souvenir,
            chaque étape importante et chaque moment précieux, de la grossesse
            jusqu'à l'âge adulte.
          </p>
        </Card>

        <div className="mt-8">
          <Link href="/onboarding">
            <Button>Commencer l'aventure</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}