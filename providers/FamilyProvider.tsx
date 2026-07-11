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
import { Family } from "@/types/Family";

type FamilyContextType = {
  family: Family;
  setFamily: React.Dispatch<React.SetStateAction<Family>>;
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

export function FamilyProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [family, setFamily] = useState<Family>(initialFamily);

  useEffect(() => {
    const saved = loadFamily();

    if (saved) {
      setFamily({
        ...initialFamily,
        ...saved,
        events: saved.events ?? [],
      });
    }
  }, []);

  useEffect(() => {
    saveFamily(family);
  }, [family]);

  return (
    <FamilyContext.Provider value={{ family, setFamily }}>
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