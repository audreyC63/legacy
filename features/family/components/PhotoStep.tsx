"use client";

import Link from "next/link";
import { useState } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import { useFamily } from "@/providers/FamilyProvider";
import { compressImage } from "@/utils/imageUtils";

export default function PhotoStep() {
  const { family, setFamily } = useFamily();

  const [preview, setPreview] = useState(
    family.profilePhoto ?? ""
  );

  const [loading, setLoading] =
    useState(false);

  async function handlePhoto(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setLoading(true);

    try {
      const image = await compressImage(file);

      setPreview(image);

      setFamily((current) => ({
        ...current,
        profilePhoto: image,
      }));
    } catch {
      window.alert(
        "Cette image n'a pas pu être ajoutée."
      );
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  }

  return (
    <Card>
      <h2 className="text-2xl font-semibold text-black">
        Une première photo 📸
      </h2>

      <p className="mt-2 text-black">
        Cette photo apparaîtra sur le profil,
        le Dashboard et le menu.
      </p>

      <label className="mt-8 flex min-h-48 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#7C9A7A] bg-[#EDF5EC] text-center">
        {preview ? (
          <img
            src={preview}
            alt="Photo de profil"
            className="h-56 w-full object-cover"
          />
        ) : (
          <div className="p-6">
            <div className="text-5xl">📸</div>

            <p className="mt-3 font-semibold text-black">
              Ajouter une photo
            </p>

            <p className="mt-1 text-sm text-black">
              Touchez ici pour choisir une image
            </p>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhoto}
        />
      </label>

      {loading && (
        <p className="mt-3 text-center text-black">
          Préparation de l’image…
        </p>
      )}

      {preview && (
        <button
          type="button"
          onClick={() => {
            setPreview("");

            setFamily((current) => ({
              ...current,
              profilePhoto: "",
            }));
          }}
          className="mt-3 w-full font-semibold text-red-700"
        >
          Retirer la photo
        </button>
      )}

      <div className="mt-8">
        <Link href="/dashboard">
          <Button disabled={loading}>
            Terminer
          </Button>
        </Link>
      </div>
    </Card>
  );
}