"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type FamilyData = {
  childName: string;
  isBorn: boolean | null;
  birthDate: string;
  pregnancyDate: string;
  motherOne: string;
  motherTwo: string;
};

type FamilyContextType = {
  family: FamilyData;
  setFamily: React.Dispatch<React.SetStateAction<FamilyData>>;
};

const FamilyContext = createContext<FamilyContextType | null>(null);

export function FamilyProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [family, setFamily] = useState<FamilyData>({
    childName: "",
    isBorn: null,
    birthDate: "",
    pregnancyDate: "",
    motherOne: "",
    motherTwo: "",
  });

  return (
    <FamilyContext.Provider
      value={{
        family,
        setFamily,
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