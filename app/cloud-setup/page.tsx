"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";

import { supabase } from "@/lib/supabase/client";
import { useFamily } from "@/providers/FamilyProvider";

function toNumberOrNull(value?: string) {
  if (!value?.trim()) return null;

  const parsed = Number(value.replace(",", "."));

  return Number.isFinite(parsed) ? parsed : null;
}

export default function CloudSetupPage() {
  const router = useRouter();
  const { family } = useFamily();

  const [checkingSession, setCheckingSession] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session?.user) {
        setUserEmail("");
        setCheckingSession(false);
        return;
      }

      setUserEmail(session.user.email ?? "");
      setCheckingSession(false);
    }

    void checkSession();
  }, []);

  async function createCloudFamily() {
    setLoading(true);
    setErrorMessage("");

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        router.replace("/login");
        return;
      }

      const user = session.user;

      const familyName = family.childName
        ? `Famille de ${family.childName}`
        : "Ma famille";

      const {
        data: familyId,
        error: familyError,
      } = await supabase.rpc("create_first_family", {
        family_name: familyName,
      });

      if (familyError) {
        throw familyError;
      }

      if (!familyId) {
        throw new Error(
          "La famille n’a pas pu être créée."
        );
      }

      const {
        data: existingChildren,
        error: searchError,
      } = await supabase
        .from("children")
        .select("id")
        .eq("family_id", familyId)
        .limit(1);

      if (searchError) {
        throw searchError;
      }

      if (!existingChildren?.length) {
        const { error: insertError } = await supabase
          .from("children")
          .insert({
            family_id: familyId,
            first_name: family.childName || "Mon enfant",
            is_born: family.isBorn,
            birth_date:
              family.isBorn === true && family.birthDate
                ? family.birthDate
                : null,
            expected_birth_date:
              family.isBorn === false && family.pregnancyDate
                ? family.pregnancyDate
                : null,
            profile_photo_path: null,
            birth_place: family.birthPlace || null,
            birth_weight_kg: toNumberOrNull(
              family.birthWeight
            ),
            birth_height_cm: toNumberOrNull(
              family.birthHeight
            ),
            blood_group: family.bloodGroup || null,
            eye_color: family.eyeColor || null,
            hair_color: family.hairColor || null,
            created_by: user.id,
          });

        if (insertError) {
          throw insertError;
        }
      }

      window.alert(
        "Votre espace familial a été créé avec succès."
      );

      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue."
      );
    } finally {
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <main className="min-h-screen bg-[#F8F6F2]">
        <div className="mx-auto max-w-md px-6 py-10">
          <Card>
            <p className="text-black">
              Vérification de la connexion…
            </p>
          </Card>
        </div>
      </main>
    );
  }

  if (!userEmail) {
    return (
      <main className="min-h-screen bg-[#F8F6F2]">
        <div className="mx-auto flex max-w-md flex-col gap-6 px-6 py-10">
          <PageHeader
            title="Connexion requise"
            subtitle="Connectez-vous avant de créer votre famille."
          />

          <Card>
            <p className="text-black">
              Aucune session Supabase active n’a été trouvée.
            </p>

            <div className="mt-6">
              <Button
                onClick={() => router.replace("/login")}
              >
                Aller à la connexion
              </Button>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F6F2]">
      <div className="mx-auto flex max-w-md flex-col gap-6 px-6 py-10">
        <PageHeader
          title="Sauvegarde cloud"
          subtitle="Créons votre famille dans Legacy."
        />

        <Card>
          <h2 className="text-2xl font-bold text-black">
            Préparer votre espace familial
          </h2>

          <p className="mt-3 text-black">
            Connecté avec : {userEmail}
          </p>

          <div className="mt-6 rounded-2xl bg-[#EDF5EC] p-4">
            <p className="font-semibold text-black">
              Enfant
            </p>

            <p className="mt-1 text-black">
              {family.childName || "Non renseigné"}
            </p>
          </div>

          {errorMessage && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
              {errorMessage}
            </div>
          )}

          <div className="mt-6">
            <Button
              onClick={createCloudFamily}
              disabled={loading}
            >
              {loading
                ? "Création en cours..."
                : "Créer mon espace familial"}
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}