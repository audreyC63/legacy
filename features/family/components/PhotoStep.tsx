"use client";

import Link from "next/link";
import { useState } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useFamily } from "@/providers/FamilyProvider";

export default function PhotoStep() {
  const { family, setFamily } = useFamily();
  const [preview, setPreview] = useState(family.profilePhoto ?? "");

  function handlePhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const image = reader.result as string;

      setPreview(image);

      setFamily((current) => ({
        ...current,
        profilePhoto: image,
      }));
    };

    reader.readAsDataURL(file);
  }

  return (
    <Card>
      <h2 className="text-2xl font-semibold text-black">
        Une première photo 📸
      </h2>

      <p className="mt-2 text-black">
        Cette photo apparaîtra sur le profil, le dashboard et le menu.
      </p>

      <label className="mt-8 flex min-h-40 w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-white">
        {preview ? (
          <img
            src={preview}
            alt="Photo de profil"
            className="h-48 w-full object-cover"
          />
        ) : (
          <span className="text-black">Cliquez pour choisir une photo</span>
        )}

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhoto}
        />
      </label>

      <div className="mt-8">
        <Link href="/dashboard">
          <Button>Terminer</Button>
        </Link>
      </div>
    </Card>
  );
}