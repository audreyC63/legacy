"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { loadFamily, saveFamily } from "@/lib/storage";
import { Family } from "@/types/Family";

type FamilyContextType = {
  family: Family;
  setFamily: React.Dispatch<React.SetStateAction<Family>>;
};

const FamilyContext = createContext<FamilyContextType | null>(null);

export function FamilyProvider({ children }: { children: ReactNode }) {
  const [family, setFamily] = useState<Family>({
    childName: "",
    isBorn: null,
    birthDate: "",
    pregnancyDate: "",
    motherOne: "",
    motherTwo: "",
    events: [],
  });

  useEffect(() => {
    const saved = loadFamily();

    if (saved) {
      setFamily(saved);
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
    throw new Error("useFamily doit être utilisé dans FamilyProvider.");
  }

  return context;
}