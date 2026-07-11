import type { Metadata } from "next";
import "./globals.css";

import QuickAddButton from "@/components/navigation/QuickAddButton";
import SideMenu from "@/components/navigation/SideMenu";
import { FamilyProvider } from "@/providers/FamilyProvider";

export const metadata: Metadata = {
  title: "Legacy",
  description: "Chaque vie mérite d'être racontée.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <FamilyProvider>
          <SideMenu />

          {children}

          <QuickAddButton />
        </FamilyProvider>
      </body>
    </html>
  );
}