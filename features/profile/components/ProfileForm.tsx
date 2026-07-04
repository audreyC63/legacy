"use client";

import { useState } from "react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ProfileForm() {
  const [firstName, setFirstName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [birthWeight, setBirthWeight] = useState("");
  const [birthHeight, setBirthHeight] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [eyeColor, setEyeColor] = useState("");
  const [hairColor, setHairColor] = useState("");

  return (
    <Card>
      <h2 className="text-xl font-semibold">
        Profil de l'enfant
      </h2>

      <div className="mt-5 space-y-4">
        <Input
          placeholder="Prénom"
          value={firstName}
          onChange={setFirstName}
        />

        <Input
          type="date"
          value={birthDate}
          onChange={setBirthDate}
        />

        <Input
          placeholder="Lieu de naissance"
          value={birthPlace}
          onChange={setBirthPlace}
        />

        <Input
          placeholder="Poids de naissance (kg)"
          value={birthWeight}
          onChange={setBirthWeight}
        />

        <Input
          placeholder="Taille de naissance (cm)"
          value={birthHeight}
          onChange={setBirthHeight}
        />

        <Input
          placeholder="Groupe sanguin"
          value={bloodGroup}
          onChange={setBloodGroup}
        />

        <Input
          placeholder="Couleur des yeux"
          value={eyeColor}
          onChange={setEyeColor}
        />

        <Input
          placeholder="Couleur des cheveux"
          value={hairColor}
          onChange={setHairColor}
        />

        <Button onClick={() => alert("Le profil sera sauvegardé dans la prochaine étape.")}>
          Enregistrer
        </Button>
      </div>
    </Card>
  );
}