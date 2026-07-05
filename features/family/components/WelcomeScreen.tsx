import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";

export default function WelcomeScreen() {
  return (
    <main className="min-h-screen bg-[#F8F6F2]">
      <div className="mx-auto flex max-w-md flex-col px-6 py-10">
        <PageHeader
          title="Bienvenue dans Legacy"
          subtitle="Chaque vie mérite d'être racontée."
        />

        <Card>
          <h2 className="text-2xl font-semibold text-black">
            Créons votre livre de vie
          </h2>

          <p className="mt-4 text-black">
            Configurez votre famille, votre enfant, puis commencez à garder les
            souvenirs importants.
          </p>

          <Link href="/onboarding/family" className="mt-8 block">
            <Button>Commencer</Button>
          </Link>
        </Card>
      </div>
    </main>
  );
}