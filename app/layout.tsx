import type { Metadata } from "next";
import "./globals.css";

import { FamilyProvider } from "@/providers/FamilyProvider";
import SideMenu from "@/components/navigation/SideMenu";

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
        </FamilyProvider>
      </body>
    </html>
  );
}