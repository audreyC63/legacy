"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
} from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

import {
  emptyCloudChildProfile,
  getChildProfile,
  saveChildProfile,
  type CloudChildProfile,
} from "@/features/profile/services/profile";

import { useFamily } from "@/providers/FamilyProvider";
import { compressImage } from "@/utils/imageUtils";

export default function ProfileForm() {
  const {
    family,
    setFamily,
    refreshCloudFamily,
  } = useFamily();

  const [form, setForm] =
    useState<CloudChildProfile>({
      ...emptyCloudChildProfile,
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        setLoading(true);
        setError(null);
        setSuccess(null);

        const result = await getChildProfile();

        if (cancelled) {
          return;
        }

        setForm(result.profile);

        setFamily((current) => ({
          ...current,
          ...result.profile,
          isBorn:
            Boolean(result.profile.birthDate) ||
            current.isBorn,
        }));
      } catch (loadError) {
        if (cancelled) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Impossible de charger le profil.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [setFamily]);

  function updateField(
    field: keyof CloudChildProfile,
    value: string,
  ) {
    setSuccess(null);
    setError(null);

    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handlePhoto(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setError(null);
      setSuccess(null);

      const compressedImage =
        await compressImage(file);

      updateField(
        "profilePhoto",
        compressedImage,
      );
    } catch {
      setError(
        "Cette image n'a pas pu être ajoutée.",
      );
    } finally {
      event.target.value = "";
    }
  }

  function removePhoto() {
    updateField("profilePhoto", "");
  }

  async function handleSave() {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (!form.childName.trim()) {
        throw new Error(
          "Le prénom de l'enfant est obligatoire.",
        );
      }

      const savedProfile =
        await saveChildProfile(form);

      setForm(savedProfile);

      setFamily((current) => ({
        ...current,
        ...savedProfile,
        isBorn: Boolean(
          savedProfile.birthDate,
        ),
      }));

      await refreshCloudFamily();

      setSuccess(
        "Profil enregistré et synchronisé.",
      );
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Impossible d'enregistrer le profil.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Card>
        <div className="py-8 text-center">
          <p className="font-semibold text-black">
            Chargement du profil…
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold text-black">
        Profil de l&apos;enfant
      </h2>

      <p className="mt-1 text-sm text-gray-600">
        Ces informations sont enregistrées dans
        Supabase et partagées avec les membres de la
        famille.
      </p>

      <div className="mt-5 space-y-4">
        {form.profilePhoto ? (
          <img
            src={form.profilePhoto}
            alt={`Photo de ${form.childName || "l'enfant"}`}
            className="mx-auto h-36 w-36 rounded-full border-4 border-[#EDF5EC] object-cover shadow-sm"
          />
        ) : (
          <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-[#EDF5EC] text-6xl">
            👶
          </div>
        )}

        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#7C9A7A] bg-[#EDF5EC] p-6 text-center">
          <span className="text-4xl">
            📸
          </span>

          <span className="mt-2 font-semibold text-black">
            {form.profilePhoto
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

        {form.profilePhoto && (
          <button
            type="button"
            onClick={removePhoto}
            className="w-full rounded-2xl px-4 py-2 font-semibold text-red-700 transition hover:bg-red-50"
          >
            Supprimer la photo
          </button>
        )}

        <div>
          <label className="mb-2 block text-sm font-semibold text-black">
            Prénom
          </label>

          <Input
            placeholder="Prénom"
            value={form.childName}
            onChange={(value) =>
              updateField(
                "childName",
                value,
              )
            }
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-black">
            Date de naissance
          </label>

          <Input
            type="date"
            value={form.birthDate}
            onChange={(value) =>
              updateField(
                "birthDate",
                value,
              )
            }
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-black">
            Lieu de naissance
          </label>

          <Input
            placeholder="Lieu de naissance"
            value={form.birthPlace}
            onChange={(value) =>
              updateField(
                "birthPlace",
                value,
              )
            }
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-black">
            Poids de naissance
          </label>

          <Input
            placeholder="Ex. 3,250 kg"
            value={form.birthWeight}
            onChange={(value) =>
              updateField(
                "birthWeight",
                value,
              )
            }
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-black">
            Taille de naissance
          </label>

          <Input
            placeholder="Ex. 49 cm"
            value={form.birthHeight}
            onChange={(value) =>
              updateField(
                "birthHeight",
                value,
              )
            }
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-black">
            Groupe sanguin
          </label>

          <Input
            placeholder="Ex. O+"
            value={form.bloodGroup}
            onChange={(value) =>
              updateField(
                "bloodGroup",
                value,
              )
            }
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-black">
            Couleur des yeux
          </label>

          <Input
            placeholder="Couleur des yeux"
            value={form.eyeColor}
            onChange={(value) =>
              updateField(
                "eyeColor",
                value,
              )
            }
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-black">
            Couleur des cheveux
          </label>

          <Input
            placeholder="Couleur des cheveux"
            value={form.hairColor}
            onChange={(value) =>
              updateField(
                "hairColor",
                value,
              )
            }
          />
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
          >
            {error}
          </p>
        )}

        {success && (
          <p
            role="status"
            className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
          >
            {success}
          </p>
        )}

        <Button
          type="button"
          disabled={saving}
          onClick={() => {
            void handleSave();
          }}
        >
          {saving
            ? "Enregistrement…"
            : "Enregistrer"}
        </Button>

        {family.birthDate &&
          family.birthDate !==
            form.birthDate && (
            <p className="text-center text-xs text-gray-500">
              Des modifications ne sont pas encore
              enregistrées.
            </p>
          )}
      </div>
    </Card>
  );
}