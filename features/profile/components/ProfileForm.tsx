"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useFamily } from "@/providers/FamilyProvider";

export default function ProfileForm() {
  const { family, setFamily } = useFamily();

  function updateField(field: string, value: string) {
    setFamily((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handlePhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      updateField("profilePhoto", reader.result as string);
    };

    reader.readAsDataURL(file);
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold">Profil de l'enfant</h2>

      <div className="mt-5 space-y-4">
        {family.profilePhoto && (
          <img
            src={family.profilePhoto}
            alt="Photo de profil"
            className="h-32 w-32 rounded-full object-cover"
          />
        )}

        <input type="file" accept="image/*" onChange={handlePhoto} />

        <Input
          placeholder="Prénom"
          value={family.childName}
          onChange={(value) => updateField("childName", value)}
        />

        <Input
          type="date"
          value={family.birthDate}
          onChange={(value) => updateField("birthDate", value)}
        />

        <Input
          placeholder="Lieu de naissance"
          value={family.birthPlace ?? ""}
          onChange={(value) => updateField("birthPlace", value)}
        />

        <Input
          placeholder="Poids de naissance (kg)"
          value={family.birthWeight ?? ""}
          onChange={(value) => updateField("birthWeight", value)}
        />

        <Input
          placeholder="Taille de naissance (cm)"
          value={family.birthHeight ?? ""}
          onChange={(value) => updateField("birthHeight", value)}
        />

        <Input
          placeholder="Groupe sanguin"
          value={family.bloodGroup ?? ""}
          onChange={(value) => updateField("bloodGroup", value)}
        />

        <Input
          placeholder="Couleur des yeux"
          value={family.eyeColor ?? ""}
          onChange={(value) => updateField("eyeColor", value)}
        />

        <Input
          placeholder="Couleur des cheveux"
          value={family.hairColor ?? ""}
          onChange={(value) => updateField("hairColor", value)}
        />

        <Button onClick={() => alert("Profil sauvegardé")}>
          Enregistrer
        </Button>
      </div>
    </Card>
  );
}