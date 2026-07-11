"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

import { useFamily } from "@/providers/FamilyProvider";
import { compressImage } from "@/utils/imageUtils";

export default function ProfileForm() {
  const { family, setFamily } = useFamily();

  function updateField(
    field: string,
    value: string
  ) {
    setFamily((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handlePhoto(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const image = await compressImage(file);

      updateField("profilePhoto", image);
    } catch {
      window.alert(
        "Cette image n'a pas pu être ajoutée."
      );
    } finally {
      event.target.value = "";
    }
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold text-black">
        Profil de l&apos;enfant
      </h2>

      <div className="mt-5 space-y-4">
        {family.profilePhoto ? (
          <img
            src={family.profilePhoto}
            alt="Photo de profil"
            className="mx-auto h-36 w-36 rounded-full border-4 border-[#EDF5EC] object-cover shadow-sm"
          />
        ) : (
          <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-[#EDF5EC] text-6xl">
            👶
          </div>
        )}

        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#7C9A7A] bg-[#EDF5EC] p-6 text-center">
          <span className="text-4xl">📸</span>

          <span className="mt-2 font-semibold text-black">
            {family.profilePhoto
              ? "Changer la photo de profil"
              : "Ajouter une photo de profil"}
          </span>

          <span className="mt-1 text-sm text-black">
            Touchez ici pour choisir une image
          </span>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhoto}
          />
        </label>

        {family.profilePhoto && (
          <button
            type="button"
            onClick={() =>
              updateField("profilePhoto", "")
            }
            className="w-full font-semibold text-red-700"
          >
            Supprimer la photo
          </button>
        )}

        <Input
          placeholder="Prénom"
          value={family.childName}
          onChange={(value) =>
            updateField("childName", value)
          }
        />

        <Input
          type="date"
          value={family.birthDate}
          onChange={(value) =>
            updateField("birthDate", value)
          }
        />

        <Input
          placeholder="Lieu de naissance"
          value={family.birthPlace ?? ""}
          onChange={(value) =>
            updateField("birthPlace", value)
          }
        />

        <Input
          placeholder="Poids de naissance (kg)"
          value={family.birthWeight ?? ""}
          onChange={(value) =>
            updateField("birthWeight", value)
          }
        />

        <Input
          placeholder="Taille de naissance (cm)"
          value={family.birthHeight ?? ""}
          onChange={(value) =>
            updateField("birthHeight", value)
          }
        />

        <Input
          placeholder="Groupe sanguin"
          value={family.bloodGroup ?? ""}
          onChange={(value) =>
            updateField("bloodGroup", value)
          }
        />

        <Input
          placeholder="Couleur des yeux"
          value={family.eyeColor ?? ""}
          onChange={(value) =>
            updateField("eyeColor", value)
          }
        />

        <Input
          placeholder="Couleur des cheveux"
          value={family.hairColor ?? ""}
          onChange={(value) =>
            updateField("hairColor", value)
          }
        />

        <Button
          onClick={() =>
            window.alert("Profil sauvegardé.")
          }
        >
          Enregistrer
        </Button>
      </div>
    </Card>
  );
}