"use client";

import { ChangeEvent } from "react";
import Link from "next/link";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import ExportPdfButton from "./ExportPdfButton";

import { useFamily } from "@/providers/FamilyProvider";
import { Family } from "@/types/Family";

const emptyFamily: Family = {
  childName: "",
  isBorn: null,
  birthDate: "",
  pregnancyDate: "",
  parentOne: "",
  parentTwo: "",
  events: [],
  profilePhoto: "",
  birthPlace: "",
  birthWeight: "",
  birthHeight: "",
  bloodGroup: "",
  eyeColor: "",
  hairColor: "",
};

function isValidFamily(value: unknown): value is Family {
  if (!value || typeof value !== "object") {
    return false;
  }

  const family = value as Partial<Family>;

  return (
    typeof family.childName === "string" &&
    Array.isArray(family.events)
  );
}

export default function SettingsPanel() {
  const { family, setFamily } = useFamily();

  function resetLegacy() {
    const confirmReset = window.confirm(
      "Voulez-vous vraiment réinitialiser Legacy ? Toutes les données seront supprimées de cet appareil."
    );

    if (!confirmReset) return;

    localStorage.removeItem("legacy-family");
    setFamily(emptyFamily);
    window.location.href = "/";
  }

  function exportData() {
    const json = JSON.stringify(family, null, 2);

    const blob = new Blob([json], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "legacy-sauvegarde.json";
    link.click();

    URL.revokeObjectURL(url);
  }

  function importData(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const imported: unknown = JSON.parse(
          reader.result as string
        );

        if (!isValidFamily(imported)) {
          throw new Error("Format Legacy invalide");
        }

        setFamily({
          ...emptyFamily,
          ...imported,
          events: imported.events ?? [],
        });

        window.alert(
          "Sauvegarde restaurée avec succès."
        );

        event.target.value = "";
      } catch {
        window.alert(
          "Le fichier sélectionné n'est pas une sauvegarde Legacy valide."
        );
      }
    };

    reader.readAsText(file);
  }

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-bold text-black">
          👶 Profil
        </h2>

        <p className="mt-2 text-black">
          Modifiez les informations de votre enfant.
        </p>

        <div className="mt-5">
          <Link href="/profile">
            <Button>Ouvrir le profil</Button>
          </Link>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-bold text-black">
          📄 Livre Legacy
        </h2>

        <p className="mt-2 text-black">
          Créez un PDF avec le profil, les souvenirs,
          les photos, la santé et la croissance.
        </p>

        <div className="mt-5">
          <ExportPdfButton />
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-bold text-black">
          💾 Sauvegarde
        </h2>

        <p className="mt-2 text-black">
          Téléchargez une copie complète de vos données.
        </p>

        <div className="mt-5">
          <Button onClick={exportData}>
            Exporter en JSON
          </Button>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-bold text-black">
          📂 Restaurer
        </h2>

        <p className="mt-2 text-black">
          Restaurez une sauvegarde Legacy précédemment
          exportée.
        </p>

        <label className="mt-5 flex cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-[#7C9A7A] bg-[#EDF5EC] p-5 text-center">
          <div>
            <div className="text-4xl">📂</div>

            <p className="mt-2 font-semibold text-black">
              Choisir une sauvegarde
            </p>

            <p className="mt-1 text-sm text-black">
              Fichier JSON Legacy
            </p>
          </div>

          <input
            hidden
            type="file"
            accept=".json,application/json"
            onChange={importData}
          />
        </label>
      </Card>

      <Card>
        <h2 className="text-xl font-bold text-black">
          ☁️ Compte Legacy
        </h2>

        <p className="mt-2 text-black">
          La synchronisation familiale arrivera avec la V2.
        </p>

        <div className="mt-5">
          <Button disabled>
            Disponible prochainement
          </Button>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-bold text-red-700">
          🗑 Zone de danger
        </h2>

        <p className="mt-2 text-black">
          Supprime toutes les données enregistrées sur cet
          appareil.
        </p>

        <div className="mt-5">
          <Button onClick={resetLegacy}>
            Réinitialiser Legacy
          </Button>
        </div>
      </Card>
    </div>
  );
}