"use client";

import Link from "next/link";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useFamily } from "@/providers/FamilyProvider";

export default function SettingsPanel() {
  const { family, setFamily } = useFamily();

  function resetLegacy() {
    const confirmReset = window.confirm(
      "Voulez-vous vraiment réinitialiser Legacy ? Toutes les données locales seront supprimées."
    );

    if (!confirmReset) return;

    localStorage.removeItem("legacy-family");

    setFamily({
      childName: "",
      isBorn: null,
      birthDate: "",
      pregnancyDate: "",
      parentOne: "",
      parentTwo: "",
      events: [],
    });

    window.location.href = "/";
  }

  function exportData() {
    const data = JSON.stringify(family, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "legacy-sauvegarde.json";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-semibold text-black">Famille</h2>
        <p className="mt-2 text-black">
          Modifiez les informations de l'enfant et de la famille.
        </p>

        <div className="mt-5">
          <Link href="/profile">
            <Button>Modifier le profil</Button>
          </Link>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-black">Sauvegarde</h2>
        <p className="mt-2 text-black">
          Exportez une copie locale de toutes vos données Legacy.
        </p>

        <div className="mt-5">
          <Button onClick={exportData}>Exporter les données</Button>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-black">Connexion</h2>
        <p className="mt-2 text-black">
          La connexion par e-mail et mot de passe arrivera avec Supabase.
        </p>

        <div className="mt-5">
          <Button disabled>Connexion bientôt disponible</Button>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-black">Danger</h2>
        <p className="mt-2 text-black">
          Réinitialise uniquement les données sauvegardées sur cet appareil.
        </p>

        <div className="mt-5">
          <Button onClick={resetLegacy}>Réinitialiser Legacy</Button>
        </div>
      </Card>
    </div>
  );
}