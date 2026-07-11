/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { loadFamily, saveFamily } from "@/lib/storage";
import { supabase } from "@/lib/supabase/client";
import { loadCloudFamily } from "@/services/cloud/loadCloudFamily";
import { Family } from "@/types/Family";

type FamilyContextType = {
  family: Family;
  setFamily: React.Dispatch<
    React.SetStateAction<Family>
  >;
  cloudFamilyId: string | null;
  cloudChildId: string | null;
  cloudLoading: boolean;
};

const FamilyContext =
  createContext<FamilyContextType | null>(null);

const initialFamily: Family = {
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

export function FamilyProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [hydrated, setHydrated] = useState(false);

  const [family, setFamily] =
    useState<Family>(initialFamily);

  const [cloudFamilyId, setCloudFamilyId] =
    useState<string | null>(null);

  const [cloudChildId, setCloudChildId] =
    useState<string | null>(null);

  const [cloudLoading, setCloudLoading] =
    useState(true);

  /*
   * Chargement local uniquement après l’hydratation.
   * Le serveur et le premier rendu du navigateur restent identiques.
   */
  useEffect(() => {
    const saved = loadFamily();

    if (saved) {
      setFamily({
        ...initialFamily,
        ...saved,
        events: saved.events ?? [],
      });
    }

    setHydrated(true);
  }, []);

  /*
   * Sauvegarde locale temporaire pendant la migration V2.
   */
  useEffect(() => {
    if (!hydrated) return;

    saveFamily(family);
  }, [family, hydrated]);

  /*
   * Chargement du profil enfant depuis Supabase.
   */
  useEffect(() => {
    if (!hydrated) return;

    let active = true;

    async function hydrateFromCloud() {
      setCloudLoading(true);

      try {
        const result = await loadCloudFamily();

        if (!active) return;

        if (!result) {
          setCloudFamilyId(null);
          setCloudChildId(null);
          return;
        }

        setCloudFamilyId(result.familyId);
        setCloudChildId(result.childId);

        setFamily((current) => ({
          ...current,
          ...result.family,

          /*
           * Les événements sont encore migrés
           * fonctionnalité par fonctionnalité.
           */
          events: current.events ?? [],

          /*
           * La photo locale reste utilisée
           * jusqu’à sa migration dans Storage.
           */
          profilePhoto:
            current.profilePhoto ?? "",
        }));
      } catch (error) {
        console.error(
          "Impossible de charger la famille depuis Supabase.",
          error
        );
      } finally {
        if (active) {
          setCloudLoading(false);
        }
      }
    }

    void hydrateFromCloud();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void hydrateFromCloud();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [hydrated]);

  /*
   * Même affichage côté serveur et au premier rendu client.
   */
  if (!hydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F6F2] px-6">
        <p className="text-center font-semibold text-black">
          Chargement de Legacy…
        </p>
      </main>
    );
  }

  return (
    <FamilyContext.Provider
      value={{
        family,
        setFamily,
        cloudFamilyId,
        cloudChildId,
        cloudLoading,
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
}

export function useFamily() {
  const context = useContext(FamilyContext);

  if (!context) {
    throw new Error(
      "useFamily doit être utilisé dans FamilyProvider."
    );
  }

  return context;
}