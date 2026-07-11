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
  setFamily: React.Dispatch<React.SetStateAction<Family>>;
  cloudFamilyId: string | null;
  cloudChildId: string | null;
  cloudLoading: boolean;
};

const FamilyContext = createContext<FamilyContextType | null>(null);

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

function getInitialFamily(): Family {
  if (typeof window === "undefined") {
    return initialFamily;
  }

  const saved = loadFamily();

  if (!saved) {
    return initialFamily;
  }

  return {
    ...initialFamily,
    ...saved,
    events: saved.events ?? [],
  };
}

export function FamilyProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [family, setFamily] = useState<Family>(getInitialFamily);

  const [cloudFamilyId, setCloudFamilyId] =
    useState<string | null>(null);

  const [cloudChildId, setCloudChildId] =
    useState<string | null>(null);

  const [cloudLoading, setCloudLoading] = useState(true);

  useEffect(() => {
    saveFamily(family);
  }, [family]);

  useEffect(() => {
    let active = true;

    async function hydrateFromCloud() {
      setCloudLoading(true);

      try {
        const result = await loadCloudFamily();

        if (!active || !result) {
          return;
        }

        setCloudFamilyId(result.familyId);
        setCloudChildId(result.childId);

        setFamily((current) => ({
          ...current,
          ...result.family,

          // Les événements restent encore locaux à cette étape.
          events: current.events ?? [],

          // La photo locale reste utilisée jusqu’à la migration Storage.
          profilePhoto: current.profilePhoto ?? "",
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
  }, []);

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