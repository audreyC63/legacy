/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import {
  createContext,
  ReactNode,
  useCallback,
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

  refreshCloudFamily: () => Promise<void>;
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
  const [hydrated, setHydrated] =
    useState(false);

  const [family, setFamily] =
    useState<Family>(initialFamily);

  const [cloudFamilyId, setCloudFamilyId] =
    useState<string | null>(null);

  const [cloudChildId, setCloudChildId] =
    useState<string | null>(null);

  const [cloudLoading, setCloudLoading] =
    useState(true);

  useEffect(() => {
    const savedFamily = loadFamily();

    if (savedFamily) {
      setFamily({
        ...initialFamily,
        ...savedFamily,
        events: savedFamily.events ?? [],
      });
    }

    setHydrated(true);
  }, []);

  /*
   * Le stockage local reste seulement un cache.
   * Supabase devient la source principale.
   */
  useEffect(() => {
    if (!hydrated) {
      return;
    }

    saveFamily(family);
  }, [family, hydrated]);

  const refreshCloudFamily =
    useCallback(async () => {
      setCloudLoading(true);

      try {
        const result = await loadCloudFamily();

        if (!result) {
          setCloudFamilyId(null);
          setCloudChildId(null);
          return;
        }

        setCloudFamilyId(result.familyId);
        setCloudChildId(result.childId);

        setFamily((current) => ({
          ...current,

          /*
           * Les valeurs Supabase remplacent
           * toujours les anciennes valeurs locales.
           */
          ...result.family,

          /*
           * Les anciens événements restent présents
           * jusqu'à leur migration complète.
           */
          events: current.events ?? [],
        }));
      } catch (error) {
        console.error(
          "Impossible de charger la famille depuis Supabase.",
          error,
        );
      } finally {
        setCloudLoading(false);
      }
    }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    void refreshCloudFamily();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void refreshCloudFamily();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [hydrated, refreshCloudFamily]);

  /*
   * Synchronisation instantanée des changements
   * effectués depuis un autre téléphone ou ordinateur.
   */
  useEffect(() => {
    if (
      !hydrated ||
      !cloudFamilyId ||
      !cloudChildId
    ) {
      return;
    }

    const channel = supabase
      .channel(
        `legacy-child-${cloudChildId}`,
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "children",
          filter: `family_id=eq.${cloudFamilyId}`,
        },
        () => {
          void refreshCloudFamily();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [
    hydrated,
    cloudFamilyId,
    cloudChildId,
    refreshCloudFamily,
  ]);

  /*
   * Au retour dans l'application, on recharge Supabase.
   * Utile sur mobile lorsque l'application a été
   * mise en arrière-plan.
   */
  useEffect(() => {
    if (!hydrated) {
      return;
    }

    function refreshWhenVisible() {
      if (
        document.visibilityState === "visible"
      ) {
        void refreshCloudFamily();
      }
    }

    function refreshOnFocus() {
      void refreshCloudFamily();
    }

    document.addEventListener(
      "visibilitychange",
      refreshWhenVisible,
    );

    window.addEventListener(
      "focus",
      refreshOnFocus,
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        refreshWhenVisible,
      );

      window.removeEventListener(
        "focus",
        refreshOnFocus,
      );
    };
  }, [hydrated, refreshCloudFamily]);

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
        refreshCloudFamily,
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
      "useFamily doit être utilisé dans FamilyProvider.",
    );
  }

  return context;
}